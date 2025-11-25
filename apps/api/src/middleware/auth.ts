import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Response } from "express";
import { auth } from "@/lib/auth/auth";
import type { RequestWithSession } from "@/types/request";

async function requireAuth(
  req: RequestWithSession,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.session = session;
    next();
  } catch (err) {
    console.error("Auth session error", err);
    return res.status(500).json({ error: "Internal auth error" });
  }
}

export { requireAuth };
