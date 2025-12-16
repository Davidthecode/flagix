import { resolveEnvironmentAndProjectIds } from "@flagix/data-sync";
import { type Request, type Response, Router } from "express";
import { TRACKING_QUEUE_KEY } from "@/constants/evaluation";
import { getRedisClient } from "@/lib/redis/client";

const router = Router();
const redis = getRedisClient();

router.post("/evaluation", async (req: Request, res: Response) => {
  res
    .status(202)
    .json({ status: "Accepted", message: "Event queued for processing." });

  const {
    apiKey,
    flagKey,
    evaluationContext,
    variationValue,
    variationName,
    variationType,
    evaluatedAt,
  } = req.body;

  if (!apiKey || !flagKey || !evaluationContext) {
    console.warn("[Tracking] Received incomplete payload.", req.body);
    return;
  }

  try {
    const ids = await resolveEnvironmentAndProjectIds(apiKey);

    if (!ids) {
      console.warn(`[Tracking] Invalid API Key received: ${apiKey}`);
      return;
    }

    const queuePayload = {
      projectId: ids.projectId,
      environmentId: ids.environmentId,
      flagKey,
      variationName: variationName || null,
      variationValue: variationValue || null,
      variationType: variationType || null,
      evaluationContextJson: JSON.stringify(evaluationContext),
      evaluatedAt: evaluatedAt
        ? new Date(evaluatedAt).toISOString()
        : new Date().toISOString(),
    };

    await redis.lpush(TRACKING_QUEUE_KEY, JSON.stringify(queuePayload));

    console.info(`[Tracking] Evaluation event queued for flag: ${flagKey}`);
  } catch (error) {
    console.error("[Tracking] Failed to process or queue event:", error);
  }
});

export default router;
