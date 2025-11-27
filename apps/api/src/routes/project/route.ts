import { db } from "@flagix/db";
import type { Prisma } from "@flagix/db/client";
import { formatDistanceToNow } from "date-fns";
import { type Response, Router } from "express";
import { PROJECT_ADMIN_ROLES } from "@/constants/project";
import {
  createEnvironmentSchema,
  createProjectSchema,
  updateProjectSchema,
} from "@/lib/validations/project";
import type { RequestWithSession } from "@/types/request";

const router = Router();

router.get("/", async (req: RequestWithSession, res: Response) => {
  const session = req.session;

  if (!session) {
    return res.json({ error: "unauthenticated", status: 401 });
  }

  const userId = session.user.id;

  try {
    const projects = await db.project.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      select: {
        id: true,
        name: true,
        description: true,
        starred: true,
        updatedAt: true,
        flags: { select: { id: true } },
        environments: { select: { id: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    const projectList = projects.map((p) => ({
      id: p.id,
      name: p.name,
      subtitle: p.description || "No description",
      flags: p.flags.length,
      environments: p.environments.length,
      lastUpdated: formatDistanceToNow(p.updatedAt, { addSuffix: true }),
      isFavorite: p.starred,
    }));

    res.json(projectList);
  } catch (error) {
    console.error("Failed to get projects:", error);
    res.status(500).json({ error: "Failed to get projects" });
  }
});

router.get("/:id", async (req: RequestWithSession, res: Response) => {
  const session = req.session;
  if (!session) {
    return res.status(401).json({ error: "unauthenticated" });
  }

  const userId = session.user.id;
  const projectId = req.params.id;

  try {
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      select: {
        id: true,
        name: true,
        environments: {
          select: {
            name: true,
            apiKey: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!project) {
      return res
        .status(404)
        .json({ error: "Project not found or unauthorized" });
    }

    const projectHeaderData = {
      id: project.id,
      name: project.name,
      environments: project.environments.map((env) => ({
        name: env.name,
        apiKey: env.apiKey,
      })),
    };

    res.json(projectHeaderData);
  } catch (error) {
    console.error(`Failed to get project ${projectId} details:`, error);
    res.status(500).json({ error: "Failed to get project details" });
  }
});

router.post("/", async (req: RequestWithSession, res: Response) => {
  const session = req.session;
  if (!session) {
    return res.json({ error: "unauthenticated", status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = createProjectSchema.parse(req.body);

    const project = await db.$transaction(async (tx) => {
      const proj = await tx.project.create({
        data: {
          name: body.name,
          description: body.description ?? null,
          ownerId: userId,
        },
      });

      await tx.projectMember.create({
        data: {
          userId,
          projectId: proj.id,
          role: "OWNER",
        },
      });

      const defaultEnvs = ["development", "staging", "production"];
      await Promise.all(
        defaultEnvs.map((name) =>
          tx.environment.create({
            data: {
              name,
              apiKey: crypto.randomUUID(),
              projectId: proj.id,
            },
          })
        )
      );

      await tx.activityLog.create({
        data: {
          projectId: proj.id,
          userId,
          actionType: "PROJECT_CREATED",
          description: `Project created: "${proj.name}".`,
          details: body,
        },
      });

      return proj;
    });

    res.status(201).json({
      id: project.id,
      name: project.name,
      subtitle: project.description || "No description",
      flags: 0,
      environments: 3,
      lastUpdated: "Just now",
      isFavorite: false,
    });
  } catch (error) {
    console.error("Failed to create project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.patch("/:id/star", async (req: RequestWithSession, res: Response) => {
  const session = req.session;
  if (!session) {
    return res.json({ error: "unauthenticated", status: 401 });
  }

  const userId = session.user.id;
  const { id } = req.params;

  try {
    const project = await db.project.findFirst({
      where: {
        id,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      select: { starred: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const updated = await db.project.update({
      where: { id },
      data: { starred: !project.starred },
      select: { starred: true },
    });

    res.json({ isFavorite: updated.starred });
  } catch (error) {
    console.error("Failed to star project:", error);
    res.status(500).json({ error: "Failed to star project" });
  }
});

router.get("/:id/dashboard", async (req: RequestWithSession, res: Response) => {
  const session = req.session;
  if (!session) {
    return res.status(401).json({ error: "unauthenticated" });
  }

  const userId = session.user.id;
  const projectId = req.params.id;

  try {
    const projectData = await db.project.findFirst({
      where: {
        id: projectId,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      select: {
        _count: {
          select: {
            flags: true,
            environments: true,
          },
        },
        environments: {
          select: {
            id: true,
            name: true,
            apiKey: true,
            lastSeenAt: true,
          },
        },
      },
    });

    if (!projectData) {
      return res.status(404).json({ error: "Project not found" });
    }

    const targetingRulesCount = await db.environmentRule.count({
      where: {
        flag: {
          projectId,
        },
      },
    });

    const recentLogs = await db.activityLog.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        description: true,
        createdAt: true,
      },
    });

    const formattedLogs = recentLogs.map((log) => ({
      time: formatDistanceToNow(log.createdAt, { addSuffix: true }),
      description: log.description,
    }));

    const flagsCount = projectData._count.flags;
    const environmentsCount = projectData._count.environments;

    const env = projectData.environments.map((e) => ({
      name: e.name,
      apiKey: e.apiKey,
      lastSeenAt: e.lastSeenAt,
    }));

    const projectDashboardData = {
      metrics: {
        totalFlags: flagsCount,
        environmentsCount,
        targetingRules: targetingRulesCount,
        evaluations: 0, // will be updated later
      },
      environments: env,
      recentActivity: formattedLogs,
    };

    res.json(projectDashboardData);
  } catch (error) {
    console.error(`Failed to get dashboard for project ${projectId}:`, error);
    res.status(500).json({ error: "Failed to get project dashboard data" });
  }
});

router.get(
  "/:projectId/environments",
  async (req: RequestWithSession, res: Response) => {
    const { projectId } = req.params;
    const session = req.session;

    if (!session || !session.user) {
      return res.status(401).json({ error: "unauthenticated" });
    }
    const userId = session.user.id;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    try {
      const project = await db.project.findFirst({
        where: {
          id: projectId,
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        select: { id: true },
      });

      if (!project) {
        return res.status(403).json({
          error: "Unauthorized: User is not a member of this project",
        });
      }

      const environments = await db.environment.findMany({
        where: { projectId },
        select: {
          id: true,
          name: true,
          apiKey: true,
          createdAt: true,
          lastSeenAt: true,
        },
        orderBy: { createdAt: "asc" },
      });

      const defaultNames = ["development", "staging", "production"];

      const response = environments.map((environment) => ({
        ...environment,
        isDefault: defaultNames.includes(environment.name.toLowerCase()),
      }));

      res.status(200).json(response);
    } catch (error) {
      console.error("Failed to fetch environments:", error);
      res.status(500).json({ error: "Failed to fetch environments" });
    }
  }
);

router.post(
  "/:projectId/environments",
  async (req: RequestWithSession, res: Response) => {
    const { projectId } = req.params;
    const session = req.session;

    if (!session || !session.user) {
      return res.status(401).json({ error: "unauthenticated" });
    }
    const userId = session.user.id;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    try {
      const project = await db.project.findFirst({
        where: {
          id: projectId,
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        select: { id: true },
      });

      if (!project) {
        return res.status(403).json({
          error: "Unauthorized: User is not a member of this project",
        });
      }

      const body = createEnvironmentSchema.parse(req.body);

      const existingEnvironment = await db.environment.findUnique({
        where: {
          projectId_name: {
            projectId,
            name: body.name,
          },
        },
      });

      if (existingEnvironment) {
        return res.status(409).json({
          error: "Environment with this name already exists in the project.",
        });
      }

      const newEnv = await db.environment.create({
        data: {
          name: body.name,
          apiKey: crypto.randomUUID(),
          projectId,
        },
        select: {
          id: true,
          name: true,
          apiKey: true,
          createdAt: true,
          lastSeenAt: true,
        },
      });

      const defaultNames = ["development", "staging", "production"];
      const isDefault = defaultNames.includes(newEnv.name.toLowerCase());

      await db.activityLog.create({
        data: {
          projectId,
          userId,
          actionType: "ENVIRONMENT_CREATED",
          description: `Created new environment: "${newEnv.name}".`,
          environmentName: newEnv.name,
          details: { apiKey: newEnv.apiKey },
        },
      });

      res.status(201).json({
        ...newEnv,
        isDefault,
      });
    } catch (error) {
      console.error("Failed to create environment:", error);
      res.status(500).json({ error: "Failed to create environment" });
    }
  }
);

router.delete(
  "/:projectId/environments/:environmentId",
  async (req: RequestWithSession, res: Response) => {
    const { projectId, environmentId } = req.params;
    const session = req.session;

    if (!session || !session.user) {
      return res.status(401).json({ error: "unauthenticated" });
    }

    const userId = session.user.id;

    if (!projectId || !environmentId) {
      return res
        .status(400)
        .json({ error: "Project ID and Environment ID are required" });
    }

    try {
      const project = await db.project.findFirst({
        where: {
          id: projectId,
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        select: { id: true },
      });

      if (!project) {
        return res.status(403).json({
          error: "Unauthorized: User is not a member of this project",
        });
      }

      const environmentToDelete = await db.environment.findUnique({
        where: { id: environmentId, projectId },
        select: { name: true },
      });

      if (!environmentToDelete) {
        return res.status(404).json({ error: "Environment not found" });
      }

      await db.activityLog.create({
        data: {
          projectId,
          userId,
          actionType: "ENVIRONMENT_DELETED",
          description: `Deleted environment: "${environmentToDelete.name}".`,
          environmentName: environmentToDelete.name,
          details: { environmentId },
        },
      });

      await db.environment.delete({
        where: {
          id: environmentId,
          projectId,
        },
      });

      res.status(204).json({});
    } catch (error) {
      console.error("Failed to delete environment:", error);
      res.status(500).json({ error: "Failed to delete environment" });
    }
  }
);

router.get(
  "/:projectId/audit-logs",
  async (req: RequestWithSession, res: Response) => {
    const { projectId } = req.params;
    const session = req.session;
    const { environmentName, limit = "20", page = "1" } = req.query;

    const take = Number.parseInt(limit as string, 10) || 20;
    const currentPage = Number.parseInt(page as string, 10) || 1;
    const skip = (currentPage - 1) * take;

    if (!session || !session.user) {
      return res.status(401).json({ error: "unauthenticated" });
    }
    const userId = session.user.id;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    try {
      const project = await db.project.findFirst({
        where: {
          id: projectId,
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        select: { id: true },
      });

      if (!project) {
        return res.status(403).json({
          error: "Unauthorized: User is not a member of this project",
        });
      }

      const whereClause: Prisma.ActivityLogWhereInput = {
        projectId,
      };

      if (environmentName && environmentName !== "All Environments") {
        whereClause.environmentName = environmentName as string;
      }

      const [logs, totalCount] = await Promise.all([
        db.activityLog.findMany({
          where: whereClause,
          select: {
            id: true,
            actionType: true,
            description: true,
            environmentName: true,
            createdAt: true,
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take,
          skip,
        }),
        db.activityLog.count({ where: whereClause }),
      ]);

      const formattedLogs = logs.map((log) => ({
        id: log.id,
        actionType: log.actionType,
        description: log.description,
        user: log.user?.name || "System",
        createdAt: log.createdAt.toISOString(),
        environmentName: log.environmentName,
      }));

      res.status(200).json({
        logs: formattedLogs,
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / take),
        limit: take,
      });
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  }
);

router.get(
  "/:projectId/settings",
  async (req: RequestWithSession, res: Response) => {
    const { projectId } = req.params;
    const session = req.session;

    if (!session || !session.user) {
      return res.status(401).json({ error: "unauthenticated" });
    }
    const userId = session.user.id;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    try {
      const projectData = await db.project.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          name: true,
          description: true,
          ownerId: true,
          members: {
            select: {
              id: true,
              role: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              role: "asc",
            },
          },
          _count: {
            select: {
              members: {
                where: { userId },
              },
            },
          },
        },
      });

      if (!projectData) {
        return res.status(404).json({ error: "Project not found" });
      }

      const isOwner = projectData.ownerId === userId;
      const isMember = projectData._count.members > 0;

      if (!isOwner && !isMember) {
        return res.status(403).json({
          error: "Unauthorized: User is not a member of this project",
        });
      }

      const currentMember = projectData.members.find(
        (m) => m.user.id === userId
      );
      const isAuthorizedToEdit =
        isOwner ||
        (currentMember && PROJECT_ADMIN_ROLES.includes(currentMember.role));

      const members = projectData.members.map((member) => ({
        id: member.id,
        user: {
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
        },
        role: member.role,
      }));

      const userRole =
        members.find((m) => m.user.id === userId)?.role ||
        (isOwner ? "OWNER" : undefined);

      const {
        members: _,
        ownerId: __,
        _count: ___,
        ...projectDetails
      } = projectData;

      res.status(200).json({
        project: projectDetails,
        members,
        userRole,
        isAuthorizedToEdit,
      });
    } catch (error) {
      console.error("Failed to fetch project settings:", error);
      res.status(500).json({ error: "Failed to fetch project settings" });
    }
  }
);

router.put("/:projectId", async (req: RequestWithSession, res: Response) => {
  const { projectId } = req.params;
  const session = req.session;

  if (!session || !session.user) {
    return res.status(401).json({ error: "unauthenticated" });
  }
  const userId = session.user.id;

  try {
    const body = updateProjectSchema.parse(req.body);

    const member = await db.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
      select: {
        role: true,
        project: {
          select: { ownerId: true },
        },
      },
    });

    const isOwner = member?.project.ownerId === userId;
    const isAuthorized =
      isOwner || (member && PROJECT_ADMIN_ROLES.includes(member.role));

    if (!isAuthorized) {
      return res.status(403).json({
        error:
          "Unauthorized: Only project owners or admins can update project details.",
      });
    }

    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: {
        name: body.name,
        description: body.description,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    await db.activityLog.create({
      data: {
        projectId,
        userId,
        actionType: "PROJECT_UPDATED",
        description: `Updated project details (Name: ${updatedProject.name}).`,
        details: body,
      },
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Failed to update project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

router.delete("/:projectId", async (req: RequestWithSession, res: Response) => {
  const { projectId } = req.params;
  const session = req.session;

  if (!session || !session.user) {
    return res.status(401).json({ error: "unauthenticated" });
  }
  const userId = session.user.id;

  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true, name: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.ownerId !== userId) {
      return res.status(403).json({
        error: "Unauthorized: Only the project owner can delete the project.",
      });
    }

    await db.project.delete({
      where: { id: projectId },
    });

    res.status(204).json({});
  } catch (error) {
    console.error("Failed to delete project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
