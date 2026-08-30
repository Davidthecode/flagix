import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const rateLimits = {
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
    prefix: "ratelimit:auth",
  }),

  sdkFlagConfig: new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(100, "60 s"),
    analytics: true,
    prefix: "ratelimit:sdk:flag-config",
  }),

  sdkSse: new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(30, "60 s"),
    analytics: true,
    prefix: "ratelimit:sdk:sse",
  }),

  sdkTracking: new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(60, "60 s"),
    analytics: true,
    prefix: "ratelimit:sdk:tracking",
  }),

  admin: new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(60, "60 s"),
    analytics: true,
    prefix: "ratelimit:admin",
  }),

  global: new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(200, "60 s"),
    analytics: true,
    prefix: "ratelimit:global",
  }),
};
