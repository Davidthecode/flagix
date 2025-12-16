import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { type Express } from "express";
import { auth } from "@/lib/auth/auth";
import { requireAuth } from "@/middleware/auth";
import flagRoutes from "@/routes/flag/route";
import flagConfigRoutes from "@/routes/flag-config/route";
import projectRoutes from "@/routes/project/route";
import sseRoutes from "@/routes/sse/route";
import trackRoutes from "@/routes/track/route";

const createApp = (): Express => {
  const app: Express = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.all("/api/auth/*splat", toNodeHandler(auth));

  app.use(express.json());

  app.use("/api/flag-config", flagConfigRoutes);
  app.use("/api/sse", sseRoutes);
  app.use("/api/track", trackRoutes);

  app.use(requireAuth);

  app.use("/api/projects", projectRoutes);
  app.use("/api/flags", flagRoutes);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
};

export default createApp;
