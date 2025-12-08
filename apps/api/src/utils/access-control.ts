import type { ProjectRole } from "@/types/project";

const ROLE_HIERARCHY: Record<ProjectRole, number> = {
  VIEWER: 0,
  MEMBER: 1,
  ADMIN: 2,
  OWNER: 3,
};

export function hasRequiredRole(
  userRole: ProjectRole,
  requiredRole: ProjectRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
