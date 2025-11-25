import type { Request } from "express";
import type { AuthSession } from "@/lib/auth/auth";

export interface RequestWithSession extends Request {
  session?: AuthSession;
}
