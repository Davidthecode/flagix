import { REDIS_CHANNEL, reloadFlagData } from "@flagix/data-sync";
import Redis from "ioredis";
import { env } from "@/config/env";

const subscriber = new Redis(env.REDIS_URL as string);

export function initializeRedisSubscriber(): void {
  subscriber.on("error", (err) => {
    console.error("[Redis Subscriber] Connection Error:", err);
  });

  subscriber.on("message", (channel, message) => {
    if (channel === REDIS_CHANNEL) {
      console.log(
        `[Redis Subscriber] Message received on ${channel}. Reloading flag data.`
      );
      reloadFlagData(message);
    }
  });

  subscriber.subscribe(REDIS_CHANNEL, (err) => {
    if (err) {
      console.error(
        `[Redis Subscriber] Failed to subscribe to ${REDIS_CHANNEL}:`,
        err
      );
    } else {
      console.log(`[Redis Subscriber] Subscribed to ${REDIS_CHANNEL}.`);
    }
  });
}
