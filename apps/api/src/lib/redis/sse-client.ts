import Redis from "ioredis";
import { env } from "@/config/env";

const sseSubscriberClient = new Redis(env.REDIS_URL as string);

sseSubscriberClient.on("error", (err) => {
  console.error("[Redis SSE Subscriber] Connection Error:", err);
});

export function getRedisSSESubscriber(): Redis {
  return sseSubscriberClient;
}
