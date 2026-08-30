import type { Ratelimit } from "@upstash/ratelimit";
import type { NextFunction, Request, Response } from "express";

export function createRateLimitMiddleware(limiter: Ratelimit) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.ip ?? "unknownn";

    const { success, limit, remaining, reset } =
      await limiter.limit(identifier);

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", reset);

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      res.setHeader("Retry-After", retryAfter);
      return res.status(429).json({
        error: "Too many requests. Please try again later.",
        retryAfter,
      });
    }

    next();
  };
}
