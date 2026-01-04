<h1 align="center">Flagix</h1>

<p align="center">
  <img src="apps/web/public/icon.png" alt="Flagix logo" width="64" height="64" />
</p>

<p align="center"><em>A simple feature flag service that supports gradual rollouts, A/B testing, and user targeting for teams.</em></p>

---

## Overview

Flagix is a lightweight feature flag management platform designed to help teams safely deploy and control features. With support for gradual rollouts, A/B testing, and user targeting, Flagix enables you to ship features faster while maintaining control over your releases.

## Features

- **Feature Flags**: Enable or disable features instantly without deploying code
- **Gradual Rollouts**: Roll out features to a percentage of your users
- **A/B Testing**: Run experiments with weighted variations
- **User Targeting**: Target specific users, segments, or attributes
- **Real-time Updates**: Changes reflect instantly in your applications
- **Multi-environment**: Manage flags across development, staging, production, and more.
- **SDKs**: Native JavaScript and React SDKs for easy integration
- **Analytics**: Track flag usage and experiment results

## Architecture

Flagix is built as a monorepo using Turborepo with the following key components:

- **Web App**: Next.js dashboard for managing flags and viewing analytics
- **API**: Express.js backend serving the REST API and real-time updates
- **Database**: PostgreSQL with Prisma ORM for data persistence
- **SDKs**: JavaScript and React libraries for client integration
- **Evaluation Core**: Core logic for flag evaluation and targeting

## Quick Start

### Using the SDKs

Install the appropriate SDK for your application:

```bash
# JavaScript SDK
npm install @flagix/js-sdk

# React SDK
npm install @flagix/react
```

```javascript
// JavaScript SDK

import { Flagix } from "@flagix/js-sdk";

// Initialize the SDK. 
await Flagix.initialize({
  apiKey: "<YOUR_API_KEY>",
  apiBaseUrl: "https://api.flagix.com",
});

// Set user context (triggers instant re-evaluation)
Flagix.setContext({ 
  userId: "user_123", 
  plan: "premium" 
});

// Evaluate a flag
const isEnabled = Flagix.evaluate("my-feature-flag");

// Listen for real-time updates
Flagix.onFlagUpdate((key) => {
  console.log(`Flag ${key} updated to:`, Flagix.evaluate(key));
});
```

```jsx
// React SDK

// Configure the provider
import { FlagixProvider } from "@flagix/react";
import { useAuth } from "./hooks/use-auth";

const options = {
  apiKey: "<YOUR_API_KEY>",
  apiBaseUrl: "https://api.flagix.com",
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <FlagixProvider
      options={options}
      context={user}
    >
      {children}
    </FlagixProvider>
  );
}


// Use in component
import { useFlag } from "@flagix/react";

export default function MyComponent() {
  const isFeatureEnabled = useFlag("my-feature-flag");

  return (
    <div>
      {isFeatureEnabled ? <NewFeature /> : <OldFeature />}
    </div>
  );
}
```

## Documentation

For full technical references, advanced targeting guides, and framework-specific examples, visit our documentation:

<a href="https://docs.flagix.com" target="_blank" rel="noopener noreferrer"><strong>docs.flagix.com</strong></a>

### Quick Links
- <a href="https://docs.flagix.com/docs/sdk/javascript" target="_blank" rel="noopener noreferrer">JavaScript SDK Reference</a>
- <a href="https://docs.flagix.com/docs/sdk/react" target="_blank" rel="noopener noreferrer">React & Next.js Guide</a>

## Contributions

Want to run Flagix locally or contribute a feature? Check out our [Contributing Guide](./.github/CONTRIBUTING.md) for a step-by-step guide.

## License

Flagix is released under the **MIT License** - see the [LICENSE](./LICENSE) file for details.
