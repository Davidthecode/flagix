import Redis, { type Redis as RedisClient } from "ioredis";
import { env } from "@/config/env";

export function getWorkerRedisClient(): RedisClient {
  const workerClient = new Redis(env.REDIS_URL as string);
  workerClient.on("error", (err) => {
    console.error("[Redis Worker Client] Connection Error:", err);
  });

  workerClient.on("ready", () => {
    console.log(
      "[Redis Worker Client] Connected successfully for blocking operations"
    );
  });

  return workerClient;
}
