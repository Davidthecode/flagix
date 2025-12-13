import { resolveEnvironmentId } from "@flagix/flag-engine";
import { type Request, type Response, Router } from "express";
import { sseHandler } from "@/lib/sse/service";

const router = Router();

router.get("/stream", async (req: Request, res: Response) => {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    return res.status(400).json({ error: "API Key is required." });
  }

  const environmentId = await resolveEnvironmentId(apiKey);

  if (!environmentId) {
    return res.status(401).end();
  }

  sseHandler(req, res, environmentId);
});

export default router;
