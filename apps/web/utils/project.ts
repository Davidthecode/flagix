import { formatDistanceToNow, isAfter, subDays, subHours } from "date-fns";

export const getProjectRoutes = (projectId: string) => [
  { href: `/projects/${projectId}/flags`, label: "Flags" },
  { href: `/projects/${projectId}/environments`, label: "Environments" },
  { href: `/projects/${projectId}/analytics`, label: "Analytics" },
  { href: `/projects/${projectId}/audit`, label: "Audit Log" },
  { href: `/projects/${projectId}/settings`, label: "Settings" },
];

export const maskApiKey = (key: string): string => {
  if (key.length <= 8) {
    return "*".repeat(key.length);
  }

  const visiblePart = key.slice(-4);
  const maskedPart = "*".repeat(key.length - 4);
  return `${maskedPart}${visiblePart}`;
};

const ACTIVE_THRESHOLD = subHours(new Date(), 3);
const STALE_THRESHOLD = subDays(new Date(), 7);

export function getIntegrationStatus(lastSeenAt: Date | null | undefined): {
  statusText: string;
  statusClass: string;
} {
  let statusText = "Never Connected";
  let statusClass = "border-red-200 bg-red-50 text-red-700";

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
  }

  return { statusText, statusClass };
}
