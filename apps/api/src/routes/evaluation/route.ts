import { db } from "@flagix/db";
import type { EvaluationContext } from "@flagix/flag-engine";
import { evaluateFlag, getFlagConfig } from "@flagix/flag-engine";
import { type Request, type Response, Router } from "express";

const router = Router();

router.post("/flag", async (req: Request, res: Response) => {
  const apiKey = req.headers["x-api-key"] as string;
  const context = req.body.context as EvaluationContext;
  const flagKey = req.body.flagKey as string;

  if (!apiKey || !flagKey) {
    return res
      .status(400)
      .json({ error: "API Key and flag key are required." });
  }

  const environment = await db.environment.findUnique({
    where: { apiKey },
    select: { id: true },
  });

  if (!environment) {
    return res.status(401).json({ error: "Invalid API Key." });
  }
  const environmentId = environment.id;

  try {
    const flagConfig = await getFlagConfig(flagKey, environmentId);

    if (!flagConfig) {
      return res.json({ enabled: false, value: null });
    }

    if (!flagConfig.enabled) {
      return res.json({
        enabled: false,
        value: flagConfig.defaultVariation.value,
      });
    }

    const result = await evaluateFlag(flagKey, context, environmentId);

    res.json(result);
  } catch (error) {
    console.error(
      `[Flag Evaluation] Failed to evaluate flag ${flagKey}:`,
      error
    );
    res.status(500).json({ error: "Evaluation failed." });
  }
});

export default router;
