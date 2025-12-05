import { formatDistanceToNow, isAfter, subDays, subHours } from "date-fns";
import type { ProjectRole } from "@/types/project";

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
  const statusClass = "border-gray-200 bg-[#F4F4F5] text-gray-800";

  if (lastSeenAt) {
    const lastSeenDate = new Date(lastSeenAt);
    const lastSeen = formatDistanceToNow(lastSeenDate, { addSuffix: true });

    if (isAfter(lastSeenDate, ACTIVE_THRESHOLD)) {
      statusText = `Active (Last seen ${lastSeen})`;
    } else if (isAfter(lastSeenDate, STALE_THRESHOLD)) {
      statusText = `Stale (Last seen ${lastSeen})`;
    } else {
      statusText = `Inactive (Last seen ${lastSeen})`;
    }
  }

  return { statusText, statusClass };
}

export const roleDisplay: Record<ProjectRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
  VIEWER: "Viewer",
};
