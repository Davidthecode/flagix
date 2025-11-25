import { toast } from "@flagix/ui/components/sonner";
import { formatDistanceToNow, isAfter, subDays, subHours } from "date-fns";
import { Clipboard, Server } from "lucide-react";
import Link from "next/link";
import { useProject } from "@/providers/project";
import type { DashboardData } from "@/types/dashboard";

type IntegrationStatusProps = {
  environments: DashboardData["environments"];
};

const ACTIVE_THRESHOLD = subHours(new Date(), 3);
const STALE_THRESHOLD = subDays(new Date(), 7);

export function IntegrationStatus({ environments }: IntegrationStatusProps) {
  const { projectId } = useProject();

  const devEnvironment =
    environments.find((e) => e.name.toLowerCase() === "development") ||
    environments[0];

  const apiKeyDisplay = devEnvironment ? devEnvironment.apiKey : "N/A";
  const environmentName = devEnvironment
    ? devEnvironment.name
    : "an environment";
  const lastSeenAt = devEnvironment?.lastSeenAt;

  let statusText = "Never Connected";
  let statusClass = "border-yellow-200 bg-yellow-50 text-yellow-700";

  if (lastSeenAt) {
    const lastSeenDate = new Date(lastSeenAt);
    const lastSeen = formatDistanceToNow(lastSeenDate, { addSuffix: true });

    if (isAfter(lastSeenDate, ACTIVE_THRESHOLD)) {
      statusText = `Active (Last seen ${lastSeen})`;
      statusClass = "border-green-200 bg-green-50 text-green-700";
    } else if (isAfter(lastSeenDate, STALE_THRESHOLD)) {
      statusText = `Stale (Last seen ${lastSeen})`;
      statusClass = "border-yellow-200 bg-yellow-50 text-yellow-700";
    } else {
      statusText = `Inactive (Last seen ${lastSeen})`;
      statusClass = "border-red-200 bg-red-50 text-red-700";
    }
  } else {
    statusText = "Never Connected";
    statusClass = "border-red-200 bg-red-50 text-red-700";
  }

  const copyToClipboard = () => {
    if (apiKeyDisplay !== "N/A") {
      navigator.clipboard.writeText(apiKeyDisplay);
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
          **{environmentName}** Environment API Key (for SDK Initialization):
        </p>

        <div className="flex items-center rounded-lg border border-gray-200 bg-[#F4F4F5] p-2 font-mono text-gray-800 text-sm">
          <code className="flex-1 overflow-x-auto whitespace-nowrap pr-2 text-xs">
            {apiKeyDisplay}
          </code>

          <button
            aria-label="Copy API Key to clipboard"
            className="ml-2 flex-shrink-0 rounded-md p-1 text-gray-500 transition-colors hover:bg-[#F4F4F5] hover:text-gray-700"
            disabled={apiKeyDisplay === "N/A"}
            onClick={copyToClipboard}
            type="button"
          >
            <Clipboard className="h-4 w-4" />
          </button>
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
