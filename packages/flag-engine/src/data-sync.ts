import { db } from "@flagix/db";
import { mapDbFlagToEngineConfig } from "./parser";
import type { EngineCache, FlagConfig } from "./types";

const CACHE: EngineCache = new Map();
const API_KEY_CACHE: Map<string, string> = new Map();

export const REDIS_CHANNEL = "flag_updates";

const getCacheKey = (environmentId: string, flagKey: string): string =>
  `${environmentId}:${flagKey}`;

/**
 * Fetches the environment id associated with the api key
 */
export async function resolveEnvironmentId(
  apiKey: string
): Promise<string | undefined> {
  if (API_KEY_CACHE.has(apiKey)) {
    return API_KEY_CACHE.get(apiKey);
  }

  const environment = await db.environment.findUnique({
    where: { apiKey },
    select: { id: true },
  });

  if (environment) {
    API_KEY_CACHE.set(apiKey, environment.id);
    return environment.id;
  }
  return;
}

/**
 * Fetches and processes data for a single flag, then updates the cache.
 */
async function loadSingleFlagConfig(
  flagKey: string,
  environmentId: string
): Promise<void> {
  const environment = await db.environment.findUnique({
    where: { id: environmentId },
    select: { projectId: true },
  });

  if (!environment) {
    console.error(`[FlagEngine] Environment ID ${environmentId} not found.`);
    return;
  }
  const { projectId } = environment;

  const dbFlag = await db.flag.findUnique({
    where: {
      projectId_key: {
        projectId,
        key: flagKey,
      },
    },
    include: {
      variations: true,
      states: { where: { environmentId } },
      rules: { where: { environmentId }, orderBy: { order: "asc" } },
    },
  });

  const cacheKey = getCacheKey(environmentId, flagKey);

  if (!dbFlag) {
    CACHE.delete(cacheKey);
    console.log(
      `[FlagEngine] Flag ${flagKey} not found in project ${projectId}. Removed from cache.`
    );
    return;
  }

  const config = mapDbFlagToEngineConfig(dbFlag, environmentId);

  if (config) {
    CACHE.set(cacheKey, config);
    console.log(
      `[FlagEngine] Successfully updated single flag config for ${flagKey} in project ${projectId}.`
    );
  } else {
    CACHE.delete(cacheKey);
    console.warn(
      `[FlagEngine] Flag ${flagKey} configuration is invalid for environment ${environmentId}. Removed from cache.`
    );
  }
}

/**
 * Retrieves a flag configuration from the in-memory cache using a composite key.
 */
export async function getFlagConfig(
  key: string,
  environmentId: string
): Promise<FlagConfig | undefined> {
  const cacheKey = getCacheKey(environmentId, key);

  let config = CACHE.get(cacheKey);
  if (config) {
    return config;
  }

  console.warn(
    `[FlagEngine] Cache miss for ${key}:${environmentId}. Loading from DB.`
  );
  await loadSingleFlagConfig(key, environmentId);

  config = CACHE.get(cacheKey);
  return config;
}

/**
 * Updates a specific flag in cache when theres a change to it in the db
 */
export async function reloadFlagData(message: string) {
  try {
    const payload = JSON.parse(message);
    const { flagKey, environmentId } = payload;

    if (flagKey && environmentId) {
      console.log(
        `[FlagEngine] Received update for flag: ${flagKey} in environment ${environmentId}. Starting single-flag reload...`
      );

      await loadSingleFlagConfig(flagKey, environmentId);
    }
  } catch (error) {
    console.error(
      "[FlagEngine] Failed to parse Redis message for reload:",
      error
    );
  }
}
