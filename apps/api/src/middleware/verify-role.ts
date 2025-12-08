import type { NextFunction, RequestHandler, Response } from "express";
import type { ProjectRole } from "@/types/project";
import type { RequestWithSession } from "@/types/request";
import { hasRequiredRole } from "@/utils/access-control";

function createRoleVerifier(requiredRole: ProjectRole): RequestHandler {
  return (req: RequestWithSession, res: Response, next: NextFunction) => {
    const userRole = req.projectRole;

    if (!userRole) {
      return res
        .status(401)
        .json({ error: "Authorization failed: User role not found." });
    }

    if (hasRequiredRole(userRole, requiredRole)) {
      next();
    } else {
      const requiredName =
        requiredRole.charAt(0) + requiredRole.slice(1).toLowerCase();
      return res.status(403).json({
        error: `Access denied. You must have the role of ${requiredName} or higher to perform this action.`,
      });
    }
  };
}

export const verifyRole = {
  OWNER: createRoleVerifier("OWNER"),
  ADMIN: createRoleVerifier("ADMIN"),
  MEMBER: createRoleVerifier("MEMBER"),
  VIEWER: createRoleVerifier("VIEWER"),
};
