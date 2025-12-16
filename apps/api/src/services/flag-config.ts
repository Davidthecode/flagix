import {
  type DbFlagWithRules,
  mapDbFlagToEngineConfig,
} from "@flagix/data-sync";
import { db } from "@flagix/db";
import type { Environment } from "@flagix/db/client";
import {
  type FlagUpdatePayload,
  getRedisClient,
  getRedisPublisher,
  REDIS_CHANNEL,
} from "@/lib/redis";

const getRedisConfigKey = (environmentId: string, flagKey: string): string =>
  `config:${environmentId}:${flagKey}`;

/**
 * Generates the FlagConfig object.
 * Writes the FlagConfig JSON to Redis.
 * Publishes the update message to Redis Pub/Sub.
 */
export async function syncAndPublishFlagUpdate(
  flagKey: string,
  environment: Pick<Environment, "id" | "projectId" | "name">,
  type: FlagUpdatePayload["type"]
): Promise<void> {
  const flag = await db.flag.findUnique({
    where: {
      projectId_key: { projectId: environment.projectId, key: flagKey },
    },
    include: {
      variations: true,
      states: {
        where: { environmentId: environment.id },
        include: { defaultVariation: true },
      },
      rules: {
        where: { environmentId: environment.id },
        orderBy: { order: "asc" },
      },
    },
  });

  const redis = getRedisClient();
  const redisKey = getRedisConfigKey(environment.id, flagKey);

  if (!flag || flag.states.length === 0) {
    await redis.del(redisKey);

    await getRedisPublisher().publish(
      REDIS_CHANNEL,
      JSON.stringify({
        flagKey,
        environmentId: environment.id,
        projectId: environment.projectId,
        type,
      })
    );
    return;
  }

  const config = mapDbFlagToEngineConfig(
    flag as DbFlagWithRules,
    environment.id
  );

  console.log("updated config published ==>", config);

  if (config) {
    await redis.set(redisKey, JSON.stringify(config));

    await getRedisPublisher().publish(
      REDIS_CHANNEL,
      JSON.stringify({
        flagKey,
        environmentId: environment.id,
        projectId: environment.projectId,
        type,
      } as FlagUpdatePayload)
    );
  } else {
    await redis.del(redisKey);
    console.warn(
      `[FlagConfigService] Failed to map config for ${flagKey}. Removed from Redis.`
    );
  }
}
