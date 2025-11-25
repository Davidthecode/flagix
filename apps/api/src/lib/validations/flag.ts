import { z } from "zod";

export const createFlagSchema = z.object({
  key: z.string().min(1, "Flag Key is required"),
  description: z.string().optional(),
  projectId: z.cuid(),
});
