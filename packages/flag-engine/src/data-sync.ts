import { db } from "@flagix/db";
import { getRedisClient } from "@/lib/redis/client";
import { mapDbFlagToEngineConfig } from "@/parser";
import type { DbFlagWithRules, EngineCache, FlagConfig } from "@/types";

const CACHE: EngineCache = new Map();
const API_KEY_CACHE: Map<string, string> = new Map();

export const REDIS_CHANNEL = "flag_updates";

const getCacheKey = (environmentId: string, flagKey: string): string =>
  `${environmentId}:${flagKey}`;

const getRedisConfigKey = (environmentId: string, flagKey: string): string =>
  `config:${environmentId}:${flagKey}`;

const getRedisApiKeyKey = (apiKey: string): string => `api_key:${apiKey}`;

/**
 * Fetches all active flag configurations for a given environment ID.
 * This is used for the initial dump when an SDK connects.
 */
export async function getEnvironmentConfig(
  environmentId: string
): Promise<Record<string, FlagConfig>> {
  const redis = getRedisClient();
  const configMap: Record<string, FlagConfig> = {};

  // Get the list of all flag keys for the environment from the DB
  const flagRecords = await db.flag.findMany({
    where: {
      states: {
        some: { environmentId },
      },
    },
    select: {
      key: true,
      id: true,
    },
  });

  const flagKeys = flagRecords.map((f) => f.key);
  const redisKeys = flagKeys.map((key) =>
    getRedisConfigKey(environmentId, key)
  );

  // Batch load all configurations from Redis using MGET
  const cachedConfigs = await redis.mget(redisKeys);

  const flagsToRefetch: Set<string> = new Set();

  cachedConfigs.forEach((configJson, index) => {
    const flagKey = flagKeys[index];

    if (configJson) {
      try {
        const config = JSON.parse(configJson) as FlagConfig;
        configMap[flagKey] = config;
      } catch (error) {
        console.error(
          `[FlagEngine] Failed to parse Redis config for ${flagKey}.`,
          error
        );
        flagsToRefetch.add(flagKey);
      }
    } else {
      flagsToRefetch.add(flagKey);
    }
  });

  if (flagsToRefetch.size > 0) {
    console.warn(
      `[FlagEngine] Redis cache miss for ${flagsToRefetch.size} flag(s). Falling back to DB.`
    );

    const missingFlags = await db.flag.findMany({
      where: {
        key: { in: Array.from(flagsToRefetch) },
        states: { some: { environmentId } },
      },
      include: {
        variations: true,
        states: { where: { environmentId } },
        rules: {
          where: { environmentId },
          orderBy: { order: "asc" },
        },
      },
    });

    for (const flag of missingFlags) {
      const config = mapDbFlagToEngineConfig(
        flag as DbFlagWithRules,
        environmentId
      );
      if (config) {
        configMap[flag.key] = config;
        await redis.set(
          getRedisConfigKey(environmentId, flag.key),
          JSON.stringify(config)
        );
      }
    }
  }

  return configMap;
}

/**
 * Fetches the environment id associated with the api key
 */
export async function resolveEnvironmentId(
  apiKey: string
): Promise<string | undefined> {
  console.log("resolving flag environment");
  const redis = getRedisClient();
  const redisKey = getRedisApiKeyKey(apiKey);

  if (API_KEY_CACHE.has(apiKey)) {
    console.log("API_KEY_CACHE available");
    return API_KEY_CACHE.get(apiKey);
  }

  const environmentId = await redis.get(redisKey);
  if (environmentId) {
    console.log("got API_KEY from redis");
    API_KEY_CACHE.set(apiKey, environmentId);
    return environmentId;
  }

  const environment = await db.environment.findUnique({
    where: { apiKey },
    select: { id: true },
  });

  if (environment) {
    console.log("got API_KEY from db");
    const id = environment.id;
    API_KEY_CACHE.set(apiKey, id);
    await redis.set(redisKey, id, "EX", 604_800);
    return id;
  }
  return;
}

/**
 * Retrieves a flag configuration using a composite key.
 */
export async function getFlagConfig(
  key: string,
  environmentId: string
): Promise<FlagConfig | undefined> {
  const redis = getRedisClient();
  const cacheKey = getCacheKey(environmentId, key);
  const redisKey = getRedisConfigKey(environmentId, key);

  let config = CACHE.get(cacheKey);
  if (config) {
    return config;
  }

  const cachedString = await redis.get(redisKey);
  if (cachedString) {
    try {
      config = JSON.parse(cachedString) as FlagConfig;
      CACHE.set(cacheKey, config);
      return config;
    } catch (error) {
      console.error(
        "[FlagEngine] Failed to parse Redis cache for key:",
        redisKey,
        error
      );
    }
  }

  return;
}

/**
 * Updates a specific flag in cache when there's a change to it (triggered by Pub/Sub).
 * It reads the pre-processed config from Redis and populates the in-memory cache.
 */
export async function reloadFlagData(message: string) {
  const redis = getRedisClient();
  try {
    const payload = JSON.parse(message);
    const { flagKey, environmentId, type } = payload;

    if (flagKey && environmentId) {
      const cacheKey = getCacheKey(environmentId, flagKey);
      const redisKey = getRedisConfigKey(environmentId, flagKey);

      console.log(
        `[FlagEngine] Received update (${type}) for ${flagKey}:${environmentId}. Syncing from Redis...`
      );

      if (type === "FLAG_DELETED" || type === "RULE_DELETED") {
        CACHE.delete(cacheKey);
        return;
      }

      const cachedString = await redis.get(redisKey);

      if (cachedString) {
        const config = JSON.parse(cachedString) as FlagConfig;
        CACHE.set(cacheKey, config);
        console.log(
          `[FlagEngine] Successfully synced and cached config for ${flagKey}:${environmentId}.`
        );
      } else {
        CACHE.delete(cacheKey);
        console.warn(
          `[FlagEngine] No configuration found in Redis for ${flagKey}:${environmentId} after update signal. Assuming deletion/stale key.`
        );
      }
    }
  } catch (error) {
    console.error(
      "[FlagEngine] Failed to parse/sync Redis message for reload:",
      error
    );
  }
}
