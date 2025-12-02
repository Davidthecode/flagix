import type { ProjectRole } from "@/types/project";

export const ROLES_INFO = [
  {
    role: "OWNER" as const,
    description:
      "Full control. Can delete the project, and transfer ownership.",
    access:
      "All administrative actions, flag management, and project destruction.",
    tagColor: "bg-gray-800 text-white font-bold",
  },
  {
    role: "ADMIN" as const,
    description:
      "Can manage members (invite/remove) and edit project settings.",
    access: "All flag management and member management.",
    tagColor: "bg-gray-700 text-white",
  },
  {
    role: "MEMBER" as const,
    description:
      "Can create and edit flags, rules, and variations in non-production environments.",
    access: "Flag creation and editing in development/staging.",
    tagColor: "bg-gray-500 text-white",
  },
  {
    role: "VIEWER" as const,
    description: "Read-only access to all project's features.",
    access: "View all settings, flags, rules, and other project details.",
    tagColor: "bg-gray-200 text-gray-700",
  },
];

export const AVAILABLE_ROLES: ProjectRole[] = ROLES_INFO.map((r) => r.role);

export const CHART_LINE_COLORS = [
  "#059669", // Emerald Green (control)
  "#34D399", // Light Emerald (Variant 1)
  "#8B5CF6", // Violet (Variant 2)
  "#EC4899", // Pink (Variant 3)
  "#F97316", // Orange (Variant 4)
];
