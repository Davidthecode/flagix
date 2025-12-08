import { db } from "@flagix/db";
import type { NextFunction, Response } from "express";
import type { RequestWithSession } from "@/types/request";
import { isAppError } from "@/utils/error";
import { resolveProjectRole } from "@/utils/project-auth";

export const resolveRoleByBodyOrQuery = async (
  req: RequestWithSession,
  res: Response,
  next: NextFunction
) => {
  const userId = req.session?.user.id;

  const projectId = req.body?.projectId || req.query?.projectId;

  if (!userId || !projectId) {
    return next();
  }

  try {
    req.projectId = projectId;
    req.projectRole = await resolveProjectRole(userId, projectId);

    return next();
  } catch (error) {
    if (isAppError(error)) {
      return res.status(error.status).json({ error: error.message });
    }

    return res.status(500).json({ error: "Authorization error." });
  }
};

export const resolveRoleByProjectParams = async (
  req: RequestWithSession,
  res: Response,
  next: NextFunction
) => {
  const userId = req.session?.user.id;
  const projectId = req.params?.projectId;

  if (!userId || !projectId) {
    return next();
  }

  try {
    req.projectId = projectId;
    req.projectRole = await resolveProjectRole(userId, projectId);

    return next();
  } catch (error) {
    console.error("Error resolving project role:", error);
    if (isAppError(error)) {
      return res.status(error.status).json({ error: error.message });
    }

    return res.status(500).json({ error: "Authorization error." });
  }
};

export const resolveRoleByFlagParams = async (
  req: RequestWithSession,
  res: Response,
  next: NextFunction
) => {
  const userId = req.session?.user.id;
  const flagId = req.params?.flagId;

  if (!userId || !flagId) {
    return next();
  }

  try {
    const flag = await db.flag.findUnique({
      where: { id: flagId },
      select: { projectId: true },
    });

    if (!flag) {
      return res.status(404).json({ error: "Flag not found." });
    }

    req.projectId = flag.projectId;
    req.projectRole = await resolveProjectRole(userId, flag.projectId);

    return next();
  } catch (error) {
    if (isAppError(error)) {
      return res.status(error.status).json({ error: error.message });
    }

    return res.status(500).json({ error: "Authorization error." });
  }
};
