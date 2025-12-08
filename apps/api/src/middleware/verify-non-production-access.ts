import type { NextFunction, Response } from "express";
import type { RequestWithSession } from "@/types/request";

const PRODUCTION_ENVIRONMENT_NAMES = ["production"];

export const verifyNonProductionAccess = (
  req: RequestWithSession,
  res: Response,
  next: NextFunction
) => {
  const userRole = req.projectRole;

  const environmentName = (req.body?.environmentName ||
    req.query?.environmentName) as string | undefined;

  const isOnlyMember = userRole === "MEMBER";

  if (!isOnlyMember || !environmentName) {
    return next();
  }

  const isProduction = PRODUCTION_ENVIRONMENT_NAMES.some(
    (prodName) => environmentName.toLowerCase() === prodName.toLowerCase()
  );

  if (isProduction) {
    return res.status(403).json({
      error:
        "Access denied. MEMBERs cannot modify feature flags in the production environment.",
    });
  }

  return next();
};
