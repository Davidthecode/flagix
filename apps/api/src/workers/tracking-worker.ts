import { db } from "@flagix/db";
import { TRACKING_QUEUE_KEY } from "@/constants/evaluation";
import { getWorkerRedisClient } from "@/lib/redis/worker-client";

const redisWorker = getWorkerRedisClient();

export async function startTrackingWorker(): Promise<void> {
  console.log("[Worker] Tracking worker started, listening for events...");

  while (true) {
    try {
      const result = await redisWorker.brpop(TRACKING_QUEUE_KEY, 0);

      if (!result || result.length !== 2) {
        continue;
      }

      const jsonString = result[1];
      const event = JSON.parse(jsonString);

      await db.flagEvaluation.create({
        data: {
          projectId: event.projectId,
          environmentId: event.environmentId,
          flagKey: event.flagKey,
          variationName: event.variationName,
          variationValue: event.variationValue,
          variationType: event.variationType,
          evaluationContextJson: event.evaluationContextJson,
          evaluatedAt: new Date(event.evaluatedAt),
        },
      });

      console.log(
        `[Worker] Successfully processed and saved evaluation for ${event.flagKey}.`
      );
    } catch (error) {
      console.error("[Worker] Error processing queue item:", error);
    }
  }
}
