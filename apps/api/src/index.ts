import createApp from "@/app";
import { env } from "@/config/env";
import { initializeRedisSubscriber } from "@/lib/redis/subscriber";

const app = createApp();
const PORT = env.PORT || "5000";

initializeRedisSubscriber();

app.listen(PORT, () => {
  console.log(`[server]: API Service running on port ${PORT}`);
});
