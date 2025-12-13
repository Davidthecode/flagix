import Redis, { type Redis as RedisClient } from "ioredis";
import { env } from "@/config/env";

let redisPublisher: RedisClient | null = null;

export const REDIS_CHANNEL = "flag_updates";

export interface FlagUpdatePayload {
  flagKey: string;
  environmentId: string;
  projectId: string;
  type:
    | "FLAG_CREATED"
    | "FLAG_UPDATED"
    | "FLAG_DELETED"
    | "FLAG_METADATA_UPDATED"
    | "FLAG_STATE_TOGGLED"
    | "RULE_UPDATED"
    | "RULE_DELETED";
}

export function getRedisPublisher(): RedisClient {
  if (!redisPublisher) {
    redisPublisher = new Redis(env.REDIS_URL as string);

    redisPublisher.on("error", (err) => {
      console.error("[Redis Publisher] Connection Error:", err);
    });

    redisPublisher.on("ready", () => {
      console.log("[Redis Publisher] Connected successfully.");
    });
  }
  return redisPublisher;
}
