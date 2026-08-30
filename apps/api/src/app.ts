import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { type Express } from "express";
import { corsOptions } from "@/config/cors";
import { rateLimits } from "@/config/rate-limit";
import { auth } from "@/lib/auth/auth";
import { requireAuth } from "@/middleware/auth";
import { createRateLimitMiddleware } from "@/middleware/rate-limit";
import flagRoutes from "@/routes/flag/route";
import flagConfigRoutes from "@/routes/flag-config/route";
import projectRoutes from "@/routes/project/route";
import sseRoutes from "@/routes/sse/route";
import trackRoutes from "@/routes/track/route";

const createApp = (): Express => {
  const app: Express = express();

  app.set("trust proxy", true);

  app.use(cors(corsOptions));

  app.use("/api/auth", createRateLimitMiddleware(rateLimits.auth));
  app.all("/api/auth/*splat", toNodeHandler(auth));

  app.use(express.json());

  app.use(
    "/api/flag-config",
    createRateLimitMiddleware(rateLimits.sdkFlagConfig),
    flagConfigRoutes
  );
  app.use("/api/sse", createRateLimitMiddleware(rateLimits.sdkSse), sseRoutes);

  // this route ideally should be `track` but is named `sync` because ad-blockers block routes with "track" in them
  // the route handles tracking events from the SDK
  app.use(
    "/api/sync",
    createRateLimitMiddleware(rateLimits.sdkTracking),
    trackRoutes
  );

  app.use(requireAuth);

  app.use(
    "/api/projects",
    createRateLimitMiddleware(rateLimits.admin),
    projectRoutes
  );
  app.use(
    "/api/flags",
    createRateLimitMiddleware(rateLimits.admin),
    flagRoutes
  );

  app.use(createRateLimitMiddleware(rateLimits.global));
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
};

export default createApp;
