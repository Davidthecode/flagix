import { REDIS_CHANNEL } from "@flagix/data-sync";
import type { Request, Response } from "express";
import { getRedisSSESubscriber } from "@/lib/redis/sse-client";

const clients: Map<string, Set<Response>> = new Map();
const subscriber = getRedisSSESubscriber();

subscriber.subscribe(REDIS_CHANNEL, (err) => {
  if (err) {
    console.error("[SSE Subscriber] Failed to subscribe:", err);
  } else {
    console.log(
      `[SSE Subscriber] Subscribed to ${REDIS_CHANNEL} for SSE broadcasting.`
    );
  }
});

subscriber.on("message", (_channel, message) => {
  try {
    console.log("action made starting update through sse");
    const payload = JSON.parse(message);
    const { environmentId, flagKey, type } = payload;

    /* look up all connected client response objects for the environmentId */
    const environmentClients = clients.get(environmentId);
    if (environmentClients) {
      const sseData = `event: flag-update\ndata: ${JSON.stringify({ flagKey, type })}\n\n`;

      console.log("sending sseData ==>", sseData);

      for (const res of environmentClients) {
        res.write(sseData);
        console.log("sseData sent");
      }
    }
  } catch (error) {
    console.error("[SSE Service] Failed to process Redis message:", error);
  }
});

/**
 * Handles the SSE connection for a specific environment.
 */
export function sseHandler(req: Request, res: Response, environmentId: string) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  if (!clients.has(environmentId)) {
    clients.set(environmentId, new Set());
  }
  clients.get(environmentId)?.add(res);

  res.write("event: connected\ndata: {}\n\n");

  req.on("close", () => {
    console.log(`[SSE] Client disconnected from environment: ${environmentId}`);
    clients.get(environmentId)?.delete(res);
    if (clients.get(environmentId)?.size === 0) {
      clients.delete(environmentId);
    }
  });
}
