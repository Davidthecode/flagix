import type { Request } from "express";
import type { AuthSession } from "@/lib/auth/auth";
import type { ProjectRole } from "@/types/project";

export interface RequestWithSession extends Request {
  session?: AuthSession;
  projectId?: string;
  projectRole?: ProjectRole;
}
