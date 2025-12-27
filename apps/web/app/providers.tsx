"use client";

import { FlagixProvider } from "@flagix/react";
import { Toaster } from "@flagix/ui/components/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

const SDK_OPTIONS = {
  apiKey: "44f19025-072d-4e7c-b24e-3d27aa95b95b",
  apiBaseUrl: "http://localhost:5000",
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
