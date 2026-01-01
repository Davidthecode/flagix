export const SNIPPETS = {
  install: (framework: string) =>
    framework === "js"
      ? "npm install @flagix/js-sdk"
      : "npm install @flagix/react",

  provider: (apiKey: string) => `import { FlagixProvider } from "@flagix/react";

const options = {
  apiKey: "${apiKey}",
  apiBaseUrl: "https://api.flagix.com",
  initialContext: {
    userId: "user_123", 
    platform: "web",
  },
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FlagixProvider options={options}>
      {children}
    </FlagixProvider>
  );
}`,

  usage: `import { useFlag, useFlagixActions } from "@flagix/react";

export default function MyComponent() {
  const isFeatureEnabled = useFlag<boolean>("my-feature-flag");
  const { track } = useFlagixActions();

  if (isFeatureEnabled) {
    return (
      <button onClick={() => track("button_click")}>
        New Feature
      </button>
    );
  }

  return <div>Old Feature</div>;
}`,

  vanilla: (apiKey: string) => `import { Flagix } from "@flagix/js-sdk";

/**
 * Initialize the SDK. 
 * Works in Browser and Node.js (v18+).
 */
await Flagix.initialize({
  apiKey: "${apiKey}",
  apiBaseUrl: "https://api.flagix.com",
  initialContext: { 
    userId: "server_user_01",
    internal: true 
  }
});

// Evaluate a flag
const isEnabled = Flagix.evaluate("my-feature-flag");

// Listen for real-time updates
Flagix.onFlagUpdate((key) => {
  const updatedValue = Flagix.evaluate(key);
  console.log(\`Flag \${key} updated to:\`, updatedValue);
});

// Track events (Conversions)
Flagix.track("server_init", { environment: process.env.NODE_ENV });`,
};
