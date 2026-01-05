export const SNIPPETS = {
  install: (framework: string) =>
    framework === "js"
      ? "npm install @flagix/js-sdk"
      : "npm install @flagix/react",

  provider: (apiKey: string) => `import { FlagixProvider } from "@flagix/react";
import { useAuth } from "./hooks/use-auth"; // Your auth hook

const options = {
  apiKey: "${apiKey}",
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const { user } = useAuth(); // Get your authenticated user

  return (
    <FlagixProvider 
      options={options} 
      context={user} // Automatically syncs flags when user changes
    >
      {children}
    </FlagixProvider>
  );
}`,

  usage: `import { useFlag } from "@flagix/react";

export default function MyComponent() {
  // Flags re-evaluate instantly when the Provider context updates
  const isFeatureEnabled = useFlag("my-feature-flag");

  if (isFeatureEnabled) {
    return (
      <ShowFeatureComponent />
    );
  }

  return <div>Old Feature</div>;
};`,

  vanilla: (apiKey: string) => `import { Flagix } from "@flagix/js-sdk";

// Initialize the SDK.  
await Flagix.initialize({
  apiKey: "${apiKey}",
});

// Set user identity (triggers instant re-evaluation)
Flagix.setContext({ 
  userId: "user_123", 
  plan: "premium" 
});

// Evaluate a flag
const isEnabled = Flagix.evaluate("my-feature-flag");

// Listen for updates
Flagix.onFlagUpdate((key) => {
  const newValue = Flagix.evaluate(key);
  console.log(\`Flag \${key} updated to:\`, newValue);
});

// Track conversions
Flagix.track("purchase_completed", { amount: 50 });`,
};
