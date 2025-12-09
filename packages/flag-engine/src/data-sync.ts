import { db } from "@flagix/db";
import { mapDbFlagToEngineConfig } from "./parser";
import type { EngineCache, FlagConfig } from "./types";

const CACHE: EngineCache = new Map();
export const REDIS_CHANNEL = "flag_updates";

const getCacheKey = (environmentId: string, flagKey: string): string =>
  `${environmentId}:${flagKey}`;

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
    console.log("CACHE in del 1 ==>", CACHE);
    console.log(
      `[FlagEngine] Flag ${flagKey} not found in project ${projectId}. Removed from cache.`
    );
    return;
  }

  const config = mapDbFlagToEngineConfig(dbFlag, environmentId);

  if (config) {
    CACHE.set(cacheKey, config);
    console.log("CACHE after set ==>", CACHE);
    console.log(
      `[FlagEngine] Successfully updated single flag config for ${flagKey} in project ${projectId}.`
    );
  } else {
    CACHE.delete(cacheKey);
    console.warn(
      `[FlagEngine] Flag ${flagKey} configuration is invalid for environment ${environmentId}. Removed from cache.`
    );
    console.log("CACHE in del2  ==>", CACHE);
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
