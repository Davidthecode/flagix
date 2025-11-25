import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export const createEnvironmentSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(50)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Name must be lowercase, alphanumeric, and use hyphens for spaces."
    ),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});
