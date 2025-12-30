import createApp from "@/app";
import { env } from "@/config/env";

const app = createApp();
const PORT = env.PORT || "5000";

app.listen(PORT, () => {
  console.log(`[server]: API Service running on port ${PORT}`);
});
