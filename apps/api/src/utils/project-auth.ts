import { db } from "@flagix/db";
import type { ProjectRole } from "@/types/project";
import { AppError } from "@/utils/error";

export async function resolveProjectRole(
  userId: string,
  projectId: string
): Promise<ProjectRole> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  if (project.ownerId === userId) {
    return "OWNER";
  }

  const member = await db.projectMember.findUnique({
    where: { userId_projectId: { userId, projectId } },
    select: { role: true },
  });

  if (member) {
    return member.role;
  }

  throw new AppError(
    "Access denied. User is not a member of this project.",
    403
  );
}
