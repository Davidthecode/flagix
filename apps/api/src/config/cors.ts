import type { CorsOptionsDelegate } from "cors";
import type { Request } from "express";
import { env } from "@/config/env";

const SDK_PREFIXES = ["/api/flag-config", "/api/sync", "/api/sse"];
const ALLOWED_ADMIN_ORIGINS = [env.FRONTEND_URL, "http://localhost:3000"];

export const corsOptions: CorsOptionsDelegate = (req, callback) => {
  const expressReq = req as Request;

  const origin = expressReq.header("Origin");
  const isSdkRoute = SDK_PREFIXES.some((path) =>
    expressReq.path.startsWith(path)
  );

  if (isSdkRoute) {
    return callback(null, {
      origin: origin || true,
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "X-Api-Key"],
      maxAge: 86_400,
    });
  }

  if (origin && ALLOWED_ADMIN_ORIGINS.includes(origin)) {
    return callback(null, {
      origin: true,
      credentials: true,
    });
  }

  callback(null, { origin: false });
};
