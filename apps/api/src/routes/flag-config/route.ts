import {
  getEnvironmentConfig,
  getFlagConfig,
  resolveEnvironmentId,
} from "@flagix/flag-engine";
import { type Request, type Response, Router } from "express";

const router = Router();

/* used by the SDK to grab all the flag configs for the connected environment */
router.get("/all", async (req: Request, res: Response) => {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    return res.status(400).json({ error: "API Key is required." });
  }

  const environmentId = await resolveEnvironmentId(apiKey);

  if (!environmentId) {
    return res.status(401).json({ error: "Invalid API Key." });
  }

  try {
    const allFlagsConfig = await getEnvironmentConfig(environmentId);

    res.setHeader(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=30"
    );
    res.json(allFlagsConfig);
  } catch (error) {
    console.error("[Flag Config] Failed to fetch all flag configs:", error);
    res
      .status(500)
      .json({ error: "Failed to load environment configuration." });
  }
});

/* used by the SDK for a targeted update after receiving an SSE notification. */
router.get("/:flagKey", async (req: Request, res: Response) => {
  const apiKey = req.headers["x-api-key"] as string;
  const flagKey = req.params.flagKey as string;

  if (!apiKey || !flagKey) {
    return res
      .status(400)
      .json({ error: "API Key and flag key are required." });
  }

  const environmentId = await resolveEnvironmentId(apiKey);

  if (!environmentId) {
    return res.status(401).json({ error: "Invalid API Key." });
  }

  try {
    const flagConfig = await getFlagConfig(flagKey, environmentId);

    if (!flagConfig) {
      return res.status(404).json({ error: "Flag configuration not found." });
    }
    res.setHeader(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=30"
    );
    res.json(flagConfig);
  } catch (error) {
    console.error(
      `[Flag Config] Failed to fetch single flag ${flagKey}:`,
      error
    );
    res.status(500).json({ error: "Failed to load flag configuration." });
  }
});

export default router;
