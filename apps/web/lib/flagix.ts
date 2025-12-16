import { Flagix } from "@flagix/js-sdk";

const SDK_OPTIONS = {
  apiKey: "44f19025-072d-4e7c-b24e-3d27aa95b95b",
  apiBaseUrl: "http://localhost:5000",
  initialContext: {
    sessionId: "session-12345",
    platform: "web",
  },
};

// We create a function to encapsulate the initialization logic
// and ensure we only attempt it once.
export async function initializeFlagixSDK() {
  if (Flagix.isInitialized()) {
    console.log("[Flagix] SDK already initialized.");
    return;
  }

  console.log("[Flagix] Initializing SDK...");
  try {
    await Flagix.initialize(SDK_OPTIONS);
    console.log("[Flagix] SDK initialization successful.");
  } catch (error) {
    console.error("[Flagix] SDK initialization failed:", error);
  }
}
