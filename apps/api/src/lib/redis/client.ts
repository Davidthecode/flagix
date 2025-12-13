import Redis, { type Redis as RedisClient } from "ioredis";
import { env } from "@/config/env";

let redisClient: RedisClient | null = null;

export function getRedisClient(): RedisClient {
  if (!redisClient) {
    redisClient = new Redis(env.REDIS_URL as string);

    redisClient.on("error", (err) => {
      console.error("[Redis Caching Client] Connection Error:", err);
    });

    redisClient.on("ready", () => {
      console.log(
        "[Redis Caching Client] Connected successfully in backend service"
      );
    });
  }
  return redisClient;
}
