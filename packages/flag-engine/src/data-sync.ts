import { db } from "@flagix/db";
import { Redis } from "@upstash/redis";
import { mapDbFlagToEngineConfig } from "./parser";
import type { EngineCache, FlagConfig } from "./types";

const CACHE: EngineCache = new Map();
export const REDIS_CHANNEL = "flag_updates";

const getCacheKey = (environmentId: string, flagKey: string): string =>
  `${environmentId}:${flagKey}`;

/**
 * Loads all flag configurations for a specific environment from the db
 * and updates the in-memory cache.
 */
async function loadAllFlagsForEnvironment(
  environmentId: string
): Promise<void> {
  const dbFlags = await db.flag.findMany({
    where: { project: { environments: { some: { id: environmentId } } } },
    include: {
      variations: true,
      states: { where: { environmentId } },
      rules: { where: { environmentId }, orderBy: { order: "asc" } },
    },
  });

  for (const key of CACHE.keys()) {
    if (key.startsWith(`${environmentId}:`)) {
      CACHE.delete(key);
    }
  }

  for (const flag of dbFlags) {
    const config = mapDbFlagToEngineConfig(flag, environmentId);
    if (config) {
      CACHE.set(getCacheKey(environmentId, flag.key), config);
    }
  }
  console.log(
    `[FlagEngine] Cache loaded for environment ${environmentId}. Total flags: ${dbFlags.length}`
  );
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
 * Initializes the engine by loading the initial configuration
 * Returns the Redis publisher instance for external use
 */
export async function startDataSync(environmentId: string) {
  await loadAllFlagsForEnvironment(environmentId);

  return Redis.fromEnv();
}

/**
 * Retrieves a flag configuration from the in-memory cache using a composite key.
 */
export function getFlagConfig(
  key: string,
  environmentId: string
): FlagConfig | undefined {
  return CACHE.get(getCacheKey(environmentId, key));
}

export async function reloadFlagData(message: string, environmentId: string) {
  try {
    const { type, flagKey, envId } = JSON.parse(message);

    if (envId === environmentId && type === "flag_changed") {
      console.log(
        `[FlagEngine] Received update for flag: ${flagKey} in environment ${envId}. Starting single-flag reload...`
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
