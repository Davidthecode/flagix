import { env } from "@/config/env";
import { EVENT_QUEUE_KEY, TRACKING_QUEUE_KEY } from "@/constants/evaluation";
import { getWorkerRedisClient } from "@/lib/redis/worker-client";
import type {
  CustomEvent,
  EvaluationEvent,
  QueueItem,
} from "@/types/evaluation";

const redisWorker = getWorkerRedisClient();
const TINYBIRD_HOST = "https://api.europe-west2.gcp.tinybird.co";

async function processQueue<T extends QueueItem>(
  queueKey: string,
  tinybirdEndpoint: string,
  formatter: (item: T) => unknown
) {
  const items = await redisWorker.lrange(queueKey, 0, 99);
  if (items.length === 0) {
    return false;
  }

  const ndjson = items
    .map((raw) => {
      const parsed = JSON.parse(raw) as T;
      return JSON.stringify(formatter(parsed));
    })
    .join("\n");

  const response = await fetch(
    `${TINYBIRD_HOST}/v0/events?name=${tinybirdEndpoint}`,
    {
      method: "POST",
      body: ndjson,
      headers: {
        Authorization: `Bearer ${env.TINYBIRD_TOKEN}`,
        "Content-Type": "application/x-ndjson",
      },
    }
  );

  if (response.ok) {
    await redisWorker.ltrim(queueKey, items.length, -1);
    console.log(
      `[Worker] Sent ${items.length} items to Tinybird endpoint: ${tinybirdEndpoint}`
    );
    return true;
  }

  const errorBody = await response.text();
  console.error(
    `[Worker] Tinybird Error (${tinybirdEndpoint}): ${response.status}`,
    errorBody
  );
  return false;
}

export async function startTrackingWorker() {
  console.log("[Worker] Worker Started...");

  while (true) {
    try {
      const hadEvaluations = await processQueue<EvaluationEvent>(
        TRACKING_QUEUE_KEY,
        "evaluations",
        (e) => ({
          timestamp: e.evaluatedAt || new Date().toISOString(),
          project_id: e.projectId,
          environment_id: e.environmentId,
          flag_key: e.flagKey,
          variation_name: e.variationName,
          distinct_id: e.distinctId,
          context: e.evaluationContextJson,
        })
      );

      const hadEvents = await processQueue<CustomEvent>(
        EVENT_QUEUE_KEY,
        "events",
        (e) => ({
          timestamp: e.timestamp || new Date().toISOString(),
          project_id: e.projectId,
          environment_id: e.environmentId,
          event_name: e.eventName,
          distinct_id: e.distinctId,
          properties: e.propertiesJson,
        })
      );

      if (!hadEvaluations && !hadEvents) {
        await new Promise((res) => setTimeout(res, 1000));
      }
    } catch (error) {
      console.error("[Worker] Critical Loop Error:", error);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}
