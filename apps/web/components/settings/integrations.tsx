"use client";

import { Button } from "@flagix/ui/components/button";
import Image from "next/image";

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    description:
      "Get real-time notifications in your Slack channels whenever flags are toggled.",
    logo: "https://svgl.app/library/slack.svg",
  },
  {
    id: "datadog",
    name: "Datadog",
    description:
      "Sync feature flag events with your Datadog event stream to correlate rollouts with system performance.",
    logo: "https://svgl.app/library/datadog.svg",
  },
  {
    id: "sentry",
    name: "Sentry",
    description:
      "Automatically tag Sentry events with the state of feature flags to debug crashes faster.",
    logo: "https://svgl.app/library/sentry.svg",
  },
  {
    id: "github",
    name: "GitHub",
    description:
      "Link feature flags to pull requests and automate flag cleanup after code is merged.",
    logo: "https://cdn.simpleicons.org/github",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description:
      "Build custom automation. Send flag change events to any URL via secure POST requests.",
    logo: "https://unpkg.com/lucide-static@latest/icons/webhook.svg",
  },
];

export function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="font-semibold text-gray-900 text-lg">Integrations</h2>
        <p className="text-gray-600 text-sm">
          Connect Flagix with the tools your team already uses.
        </p>
      </div>

      <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
        {INTEGRATIONS.map((app) => (
          <div
            className="flex flex-col items-start justify-between gap-4 p-5 transition-colors hover:bg-gray-50/50 md:flex-row md:items-center"
            key={app.id}
          >
            <div className="flex items-start gap-4">
              <div className="relative mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm">
                <Image
                  alt={`${app.name} icon`}
                  className="object-contain"
                  height={28}
                  src={app.logo}
                  unoptimized
                  width={28}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {app.name}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-[10px] text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
                    Coming Soon
                  </span>
                </div>
                <p className="max-w-xl text-[13px] text-gray-600 leading-relaxed">
                  {app.description}
                </p>
              </div>
            </div>

            <Button
              className="rounded-sm bg-emerald-600 px-5 py-2 font-medium text-white text-xs hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={true}
            >
              Connect
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
