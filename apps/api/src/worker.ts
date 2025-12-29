import http from "node:http";
import { env } from "@/config/env";
import { startTrackingWorker } from "@/workers/tracking-worker";

function main() {
  const PORT = Number(env.PORT) || 10_000;
  http
    .createServer((_req, res) => {
      res.writeHead(200);
      res.end("Worker is running");
    })
    .listen(PORT, "0.0.0.0");

  console.log(`[Worker] Health check server on port ${PORT}`);

  startTrackingWorker();
}

main();
