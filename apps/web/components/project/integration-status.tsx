"use client";

import { Button } from "@flagix/ui/components/button";
import { toast } from "@flagix/ui/components/sonner";
import { Clipboard, Eye, EyeOff, Server } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useProject } from "@/providers/project";
import type { DashboardData } from "@/types/dashboard";
import { getIntegrationStatus, maskApiKey } from "@/utils/project";

type IntegrationStatusProps = {
  environments: DashboardData["environments"];
};

export function IntegrationStatus({ environments }: IntegrationStatusProps) {
  const { projectId } = useProject();
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  const devEnvironment =
    environments.find((e) => e.name.toLowerCase() === "development") ||
    environments[0];

  const apiKey = devEnvironment ? devEnvironment.apiKey : "N/A";
  const environmentName = devEnvironment
    ? devEnvironment.name
    : "an environment";
  const lastSeenAt = devEnvironment?.lastSeenAt;

  let displayKey: string;

  if (apiKey === "N/A") {
    displayKey = "N/A";
  } else if (isKeyVisible) {
    displayKey = apiKey;
  } else {
    displayKey = maskApiKey(apiKey);
  }

  const { statusText, statusClass } = getIntegrationStatus(lastSeenAt);

  const copyToClipboard = () => {
    if (apiKey !== "N/A") {
      navigator.clipboard.writeText(apiKey);
      toast.success("API Key Copied!");
    }
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-700 text-lg">
        <Server className="h-5 w-5" /> SDK Integration Status
      </h3>
      <div className="mb-4">
        <p className="mb-2 text-gray-600 text-sm">
          {environmentName} Environment API Key (for SDK Initialization):
        </p>

        <div className="flex items-center rounded-lg border border-gray-200 bg-[#F4F4F5] p-2 font-mono text-gray-800 text-sm">
          <code className="flex-1 overflow-x-auto whitespace-nowrap pr-2 text-xs">
            {displayKey}
          </code>

          <Button
            aria-label={isKeyVisible ? "Hide API Key" : "Show API Key"}
            className="ml-2 shrink-0 rounded-md p-1 text-gray-500 transition-colors hover:bg-[#F4F4F5] hover:text-gray-700"
            disabled={apiKey === "N/A"}
            onClick={() => setIsKeyVisible((prev) => !prev)}
            type="button"
          >
            {isKeyVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>

          <Button
            aria-label="Copy API Key to clipboard"
            className="ml-2 shrink-0 rounded-md p-1 text-gray-500 transition-colors hover:bg-[#F4F4F5] hover:text-gray-700"
            disabled={apiKey === "N/A"}
            onClick={copyToClipboard}
            type="button"
          >
            <Clipboard className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between border-gray-100 border-t pt-3 text-xs">
        <span
          className={`rounded-full border px-3 py-1 font-semibold ${statusClass}`}
        >
          {statusText}
        </span>
        <Link
          className="font-medium text-emerald-600 text-sm hover:text-emerald-70 hover:underline"
          href={`/projects/${projectId}/environments`}
        >
          View Integration Details
        </Link>
      </div>
    </div>
  );
}
