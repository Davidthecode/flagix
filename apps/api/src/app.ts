import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { type Express } from "express";
import { corsOptions } from "@/config/cors";
import { auth } from "@/lib/auth/auth";
import { requireAuth } from "@/middleware/auth";
import flagRoutes from "@/routes/flag/route";
import flagConfigRoutes from "@/routes/flag-config/route";
import projectRoutes from "@/routes/project/route";
import sseRoutes from "@/routes/sse/route";
import trackRoutes from "@/routes/sync/route";

const createApp = (): Express => {
  const app: Express = express();

  app.set("trust proxy", true);

  app.use(cors(corsOptions));

  app.all("/api/auth/*splat", toNodeHandler(auth));

  app.use(express.json());

  app.use("/api/flag-config", flagConfigRoutes);
  app.use("/api/sse", sseRoutes);

  // this route ideally should be `track` but is named `sync` because ad-blockers block routes with "track" in them
  // the route handles tracking events from the SDK
  app.use("/api/sync", trackRoutes);

  app.use(requireAuth);

  app.use("/api/projects", projectRoutes);
  app.use("/api/flags", flagRoutes);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
};

export default createApp;
