import { db } from "@flagix/db";
import type { FlagConfig } from "@flagix/evaluation-core";
import { getRedisClient } from "@/lib/redis/client";
import { mapDbFlagToEngineConfig } from "@/parser";
import type { DbFlagWithRules } from "@/types";

const API_KEY_CACHE: Map<string, string> = new Map();

export const REDIS_CHANNEL = "flag_updates";

const getRedisConfigKey = (environmentId: string, flagKey: string): string =>
  `config:${environmentId}:${flagKey}`;

const getRedisApiKeyKey = (apiKey: string): string => `api_key:${apiKey}`;

/**
 * Fetches all active flag configurations for a given environment ID.
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
  const redisKey = getRedisConfigKey(environmentId, key);

  const cachedString = await redis.get(redisKey);
  if (cachedString) {
    try {
      return JSON.parse(cachedString) as FlagConfig;
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
