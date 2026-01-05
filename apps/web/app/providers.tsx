"use client";

import { FlagixProvider } from "@flagix/react";
import { Toaster } from "@flagix/ui/components/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { env } from "@/config/env";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 1000 * 60 * 30,
    },
  },
});

const SDK_OPTIONS = {
  apiKey: env.FLAGIX_SDK_API_KEY as string,
  __internal_baseUrl: env.FLAGIX_SDK_BASE_URL,
  initialContext: {
    sessionId: "session-12345",
    platform: "web",
  },
  logs: {
    level: "info",
  },
} as const;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <FlagixProvider options={SDK_OPTIONS}>{children}</FlagixProvider>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
