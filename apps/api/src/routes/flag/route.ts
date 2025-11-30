import { db } from "@flagix/db";
import { Prisma } from "@flagix/db/client";
import { formatDistanceToNow } from "date-fns";
import { type Response, Router } from "express";
import { createFlagSchema } from "@/lib/validations/flag";
import type { RequestWithSession } from "@/types/request";

interface UpdateVariationsPayload {
  variations: {
    name: string;
    value: boolean | string | number;
    type: string;
    id?: string;
  }[];
  projectId: string;
}

interface ToggleFlagStatePayload {
  environmentName: string;
  isEnabled: boolean;
  projectId: string;
}

const router = Router();

router.get("/", async (req: RequestWithSession, res: Response) => {
  const session = req.session;
  if (!session) {
    return res.status(401).json({ error: "unauthenticated" });
  }

  const { projectId } = req.query;

  if (typeof projectId !== "string" || !projectId) {
    return res
      .status(400)
      .json({ error: "projectId query parameter is required" });
  }

  const userId = session.user.id;

  try {
    const projectAccess = await db.project.findFirst({
      where: {
        id: projectId,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      select: { id: true },
    });

    if (!projectAccess) {
      return res
        .status(403)
        .json({ error: "Unauthorized or Project not found" });
    }

    const flags = await db.flag.findMany({
      where: { projectId },
      select: {
        id: true,
        key: true,
        description: true,
        updatedAt: true,
        states: {
          select: {
            enabled: true,
            environment: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Format flag data
    const formattedFlags = flags.map((flag) => {
      const environments: Record<string, boolean> = {};

      for (const state of flag.states) {
        environments[state.environment.name] = state.enabled;
      }

      const updatedAtDistance = formatDistanceToNow(flag.updatedAt, {
        addSuffix: true,
      });

      return {
        id: flag.id,
        key: flag.key,
        description: flag.description || "",
        environments,
        updatedAt: updatedAtDistance,
      };
    });

    res.json(formattedFlags);
  } catch (error) {
    console.error(`Failed to get flags for project ${projectId}:`, error);
    res.status(500).json({ error: "Failed to get flags" });
  }
});

router.post("/", async (req: RequestWithSession, res: Response) => {
  const session = req.session;
  if (!session) {
    return res.status(401).json({ error: "unauthenticated" });
  }

  try {
    const { key, description, projectId } = createFlagSchema.parse(req.body);

    const project = await db.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        ownerId: true,
        environments: { select: { id: true, name: true } },
        members: { where: { userId: session.user.id } },
      },
    });

    if (
      !project ||
      (project.ownerId !== session.user.id && project.members.length === 0)
    ) {
      return res.status(403).json({ error: "Unauthorized access to project" });
    }

    const newFlag = await db.$transaction(async (tx) => {
      // Create the main Flag record
      const flag = await tx.flag.create({
        data: {
          key,
          description,
          projectId,
        },
      });

      // Create the default variations (boolean ON and OFF)
      const _onVariation = await tx.variation.create({
        data: {
          flagId: flag.id,
          name: "on",
          value: true,
          type: "boolean",
        },
      });

      const offVariation = await tx.variation.create({
        data: {
          flagId: flag.id,
          name: "off",
          value: false,
          type: "boolean",
        },
      });

      // Create FlagState for all environments in the project
      const environmentStatesData = project.environments.map((env) => ({
        flagId: flag.id,
        environmentId: env.id,
        enabled: false, // Default to disabled upon creation
        defaultVariationId: offVariation.id, // Default to the 'off' variation when no rules match
      }));

      await tx.flagState.createMany({
        data: environmentStatesData,
      });

      await tx.activityLog.create({
        data: {
          projectId,
          userId: session.user.id,
          actionType: "FLAG_CREATED",
          description: `Created new feature flag: ${flag.key}`,
        },
      });

      return {
        id: flag.id,
        key: flag.key,
        description: flag.description,
        // Transforms the array of environment objects into a map (key: environment name, value: state)
        environments: project.environments.reduce(
          (acc, env) => {
            acc[env.name] = false;
            return acc;
          },
          {} as Record<string, boolean>
        ),
        updatedAt: new Date().toISOString(),
      };
    });

    res.status(201).json(newFlag);
  } catch (error) {
    console.error("Failed to create flag:", error);
    res.status(500).json({ error: "Failed to create flag" });
  }
});

router.get("/:flagId", async (req: RequestWithSession, res: Response) => {
  const session = req.session;
  if (!session) {
    return res.status(401).json({ error: "unauthenticated" });
  }

  const { flagId } = req.params;
  const { environmentName } = req.query;

  if (!flagId || typeof environmentName !== "string") {
    return res
      .status(400)
      .json({ error: "Flag ID and environment name are required." });
  }

  const userId = session.user.id;

  try {
    const flagData = await db.flag.findUnique({
      where: { id: flagId },
      select: {
        id: true,
        key: true,
        description: true,
        createdAt: true,
        projectId: true,
        variations: {
          select: { id: true, name: true, value: true, type: true },
          orderBy: { createdAt: "asc" },
        },
        project: {
          select: {
            id: true,
            ownerId: true,
            members: { where: { userId } },
            environments: { select: { id: true, name: true } },
          },
        },
        states: {
          select: {
            environment: { select: { id: true, name: true } },
            enabled: true,
            defaultVariation: {
              select: { id: true, name: true, value: true, type: true },
            },
          },
        },
        // Load rules specific to the requested environment
        rules: {
          where: { environment: { name: environmentName } },
          select: {
            id: true,
            order: true,
            type: true,
            description: true,
            conditions: true,
            rolloutPercentage: true,
            variation: { select: { name: true } },
            distribution: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!flagData) {
      return res.status(404).json({ error: "Flag not found." });
    }

    const project = flagData.project;
    if (project.ownerId !== userId && project.members.length === 0) {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    const defaultOffVariation = flagData.variations.find(
      (variation) => variation.name === "off"
    );

    const allEnvironments = project.environments.map(
      (environment) => environment.name
    );

    // format rules
    const targetingRules = flagData.rules.map((rule) => ({
      id: rule.id,
      description: rule.description,
      ruleType: rule.type,
      targetVariation: rule.variation?.name, // Target variation for 'targeting' rules
      rolloutPercentage: rule.rolloutPercentage,
      variationSplits: // Distribution for 'experiment' rules
        rule.type === "experiment"
          ? JSON.parse(rule.distribution as string)
          : undefined,
      conditions: rule.conditions ? JSON.parse(rule.conditions as string) : [],
    }));

    // Format the final output structure
    const formattedConfig = {
      id: flagData.id,
      key: flagData.key,
      description: flagData.description,
      createdAt: flagData.createdAt.toISOString().split("T")[0],
      variations: flagData.variations.map((variation) => ({
        name: variation.name,
        value: JSON.parse(variation.value as string),
        type: variation.type,
      })),

      // we get only the Environment Config of the environment requested and include status for others
      environments: Object.fromEntries(
        allEnvironments.map((environment) => {
          // Find the specific state record for the current environment name
          const state = flagData.states.find(
            (s) => s.environment.name === environment
          );

          const envDefaultVariationName =
            state?.defaultVariation?.name || defaultOffVariation?.name || "off";

          // Determine the detailed rules for this environment.
          // We only include the full rules array if this is the active requested environment.
          const rulesForEnvironment =
            environment === environmentName ? targetingRules : [];

          return [
            environment,
            {
              isEnabled: state?.enabled ?? false,
              targetingRules: rulesForEnvironment,
              defaultVariationName: envDefaultVariationName,
            },
          ];
        })
      ),
    };

    res.json(formattedConfig);
  } catch (error) {
    console.error(`Failed to get flag config for ${flagId}:`, error);
    res.status(500).json({ error: "Failed to load flag configuration" });
  }
});

router.put(
  "/:flagId/variations",
  async (req: RequestWithSession, res: Response) => {
    if (!req.session) {
      return res.status(401).json({ error: "unauthenticated" });
    }

    const userId = req.session.user.id;
    const { flagId } = req.params;
    const { variations, projectId } = req.body as UpdateVariationsPayload;

    if (!variations || variations.length === 0) {
      return res.status(400).json({
        error: "Invalid variations or default variation name provided.",
      });
    }

    try {
      const projectAccess = await db.project.findFirst({
        where: {
          id: projectId,
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        select: { id: true },
      });

      if (!projectAccess) {
        return res
          .status(403)
          .json({ error: "Unauthorized or Project not found." });
      }

      const existingVariations = await db.variation.findMany({
        where: { flagId },
        select: { id: true, name: true },
      });

      await db.$transaction(async (tx) => {
        const keptVariationNames = new Set(variations.map((v) => v.name));

        for (const variation of variations) {
          const isNew = !existingVariations.some(
            (existingVariation) => existingVariation.name === variation.name
          );
          const updateData = {
            name: variation.name,
            value: JSON.stringify(variation.value),
            type: variation.type,
          };

          if (isNew) {
            await tx.variation.create({
              data: { ...updateData, flagId },
            });
          } else {
            const existingId = existingVariations.find(
              (v) => v.name === variation.name
            )?.id;

            await tx.variation.update({
              where: { id: existingId },
              data: updateData,
            });
          }
        }

        // Delete Old Variations if they are not in the new payload
        const variationsToDelete = existingVariations.filter(
          (existingVariation) => !keptVariationNames.has(existingVariation.name)
        );

        if (variationsToDelete.length > 0) {
          await tx.variation.deleteMany({
            where: { id: { in: variationsToDelete.map((v) => v.id) } },
          });
        }

        await tx.activityLog.create({
          data: {
            projectId,
            userId,
            actionType: "FLAG_VARIATIONS_UPDATED",
            description: `Updated variations for flag ${flagId}. Created/Updated: ${variations.length}, Deleted: ${variationsToDelete.length}.`,
            details: {
              variations: variations.map((v) => v.name),
              deleted: variationsToDelete.map((v) => v.name),
            },
          },
        });
      });

      const updatedVariations = await db.variation.findMany({
        where: { flagId },
      });

      res.json(updatedVariations);
    } catch (error) {
      console.error(`Failed to update variations for ${flagId}:`, error);
      res.status(500).json({ error: "Failed to save variations" });
    }
  }
);

router.put(
  "/:flagId/default-variation",
  async (req: RequestWithSession, res: Response) => {
    if (!req.session) {
      return res.status(401).json({ error: "unauthenticated" });
    }

    const userId = req.session.user.id;
    const { flagId } = req.params;
    const { defaultVariationName, environmentName, projectId } = req.body as {
      defaultVariationName: string;
      environmentName: string;
      projectId: string;
    };

    if (!defaultVariationName || !environmentName) {
      return res.status(400).json({
        error: "Default variation name and environment name are required.",
      });
    }

    try {
      const projectAccess = await db.project.findFirst({
        where: {
          id: projectId,
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        select: { id: true },
      });

      if (!projectAccess) {
        return res
          .status(403)
          .json({ error: "Unauthorized or Project not found." });
      }

      // find the ID of the new default variation
      const newDefaultVariation = await db.variation.findFirst({
        where: { flagId, name: defaultVariationName },
        select: { id: true, name: true },
      });

      if (!newDefaultVariation) {
        return res
          .status(404)
          .json({ error: "Specified default variation not found." });
      }

      const newDefaultVariationId = newDefaultVariation.id;

      // Find the FlagState ID for the specific environment
      const flagState = await db.flagState.findFirst({
        where: {
          flagId,
          environment: { name: environmentName },
        },
        select: { id: true },
      });

      if (!flagState) {
        return res.status(404).json({
          error: `Flag state not found for environment: ${environmentName}.`,
        });
      }

      // Update the FlagState's defaultVariationId
      await db.flagState.update({
        where: { id: flagState.id },
        data: { defaultVariationId: newDefaultVariationId },
      });

      await db.activityLog.create({
        data: {
          projectId,
          userId,
          actionType: "FLAG_DEFAULT_VARIATION_UPDATED",
          description: `Updated default variation for flag ${flagId} in ${environmentName} to "${newDefaultVariation.name}".`,
          environmentName,
          details: {
            defaultVariationName: newDefaultVariation.name,
          },
        },
      });

      res.json({ defaultVariationName: newDefaultVariation.name });
    } catch (error) {
      console.error(
        `Failed to update default variation for ${flagId} in ${environmentName}:`,
        error
      );
      res.status(500).json({ error: "Failed to update default variation." });
    }
  }
);

router.put("/:flagId/state", async (req: RequestWithSession, res: Response) => {
  if (!req.session) {
    return res.status(401).json({ error: "unauthenticated" });
  }

  const userId = req.session.user.id;
  const { flagId } = req.params;
  const { environmentName, isEnabled, projectId } =
    req.body as ToggleFlagStatePayload;

  if (!environmentName || typeof isEnabled !== "boolean" || !projectId) {
    return res.status(400).json({
      error: "Environment name, enabled state, and Project ID are required.",
    });
  }

  try {
    const projectAccess = await db.project.findFirst({
      where: {
        id: projectId,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      select: {
        id: true,
        environments: {
          where: { name: environmentName },
          select: { id: true },
        },
      },
    });

    if (!projectAccess || projectAccess.environments.length === 0) {
      return res
        .status(403)
        .json({ error: "Unauthorized access or environment not found." });
    }

    const environmentId = projectAccess.environments[0].id;

    const updatedState = await db.flagState.update({
      where: {
        flagId_environmentId: {
          flagId,
          environmentId,
        },
      },
      data: {
        enabled: isEnabled,
      },
      select: {
        enabled: true,
        flagId: true,
        environment: { select: { name: true } },
      },
    });

    await db.activityLog.create({
      data: {
        projectId,
        userId,
        actionType: "FLAG_STATE_TOGGLED",
        description: `Flag ${flagId} turned ${isEnabled ? "ON" : "OFF"} in ${environmentName}.`,
        environmentName,
        details: {
          isEnabled,
        },
      },
    });

    res.json({ success: true, isEnabled: updatedState.enabled });
  } catch (error) {
    console.error(
      `Failed to toggle flag ${flagId} in ${environmentName}:`,
      error
    );
    res.status(500).json({ error: "Failed to update flag state." });
  }
});

router.post(
  "/:flagId/rules",
  async (req: RequestWithSession, res: Response) => {
    if (!req.session) {
      return res.status(401).json({ error: "unauthenticated" });
    }

    const userId = req.session.user.id;
    const { flagId } = req.params;
    const { environmentName, projectId, rule } = req.body;

    if (!environmentName || !projectId || !rule.description || !rule.ruleType) {
      return res
        .status(400)
        .json({ error: "Missing required rule parameters." });
    }

    try {
      const environment = await db.environment.findFirst({
        where: {
          projectId,
          name: environmentName,
          project: {
            OR: [{ ownerId: userId }, { members: { some: { userId } } }],
          },
        },
        select: { id: true },
      });

      if (!environment) {
        return res
          .status(403)
          .json({ error: "Unauthorized access or environment not found." });
      }

      const environmentId = environment.id;

      const newRuleId = await db.$transaction(async (tx) => {
        const existingRules = await tx.environmentRule.findMany({
          where: { flagId, environmentId },
          orderBy: { order: "desc" },
          select: { id: true, order: true },
        });

        // Increment the order of all existing rules in this environment
        for (const existingRule of existingRules) {
          await tx.environmentRule.update({
            where: { id: existingRule.id },
            data: { order: existingRule.order + 1 },
          });
        }

        let variationId: string | undefined;
        let distributionJson: string | typeof Prisma.JsonNull = Prisma.JsonNull;
        let rolloutPercentage: number | undefined;

        if (rule.ruleType === "targeting") {
          const targetVariation = await tx.variation.findFirst({
            where: { flagId, name: rule.targetVariation },
            select: { id: true },
          });
          if (!targetVariation) {
            throw new Error(
              `Target variation '${rule.targetVariation}' not found.`
            );
          }
          variationId = targetVariation.id;
          rolloutPercentage = rule.rolloutPercentage;
        } else {
          // experiment
          distributionJson = JSON.stringify(rule.variationSplits);
        }

        const newRule = await tx.environmentRule.create({
          data: {
            flagId,
            environmentId,
            order: 0,
            type: rule.ruleType,
            description: rule.description,
            conditions:
              rule.conditions.length > 0
                ? JSON.stringify(rule.conditions)
                : Prisma.JsonNull,
            rolloutPercentage,
            variationId,
            distribution: distributionJson,
          },
          select: { id: true, order: true },
        });

        await tx.activityLog.create({
          data: {
            projectId,
            userId,
            actionType: "FLAG_RULE_CREATED",
            description: `Added a new '${rule.ruleType}' rule for flag ${flagId} in ${environmentName}: "${rule.description}".`,
            environmentName,
            details: {
              ruleId: newRule.id,
              ruleType: rule.ruleType,
              conditions: rule.conditions,
            },
          },
        });

        return newRule.id;
      });

      const newRule = {
        id: newRuleId,
        description: rule.description,
        ruleType: rule.ruleType,
        conditions: rule.conditions,
        targetVariation: rule.targetVariation || undefined,
        rolloutPercentage: rule.rolloutPercentage || undefined,
        variationSplits: rule.variationSplits || undefined,
      };

      res.json(newRule);
    } catch (error) {
      console.error(
        `Failed to add rule to flag ${flagId} in ${environmentName}:`,
        error
      );
      res.status(500).json({ error: "Failed to add targeting rule." });
    }
  }
);

router.put(
  "/:flagId/rules/reorder",
  async (req: RequestWithSession, res: Response) => {
    if (!req.session) {
      return res.status(401).json({ error: "unauthenticated" });
    }

    const { flagId } = req.params;
    const { environmentName, projectId, ruleIdsInNewOrder } = req.body;

    if (!environmentName || !projectId || !Array.isArray(ruleIdsInNewOrder)) {
      return res
        .status(400)
        .json({ error: "Missing required parameters for reordering." });
    }

    try {
      const environment = await db.environment.findFirst({
        where: {
          projectId,
          name: environmentName,
          project: {
            OR: [
              { ownerId: req.session.user.id },
              { members: { some: { userId: req.session.user.id } } },
            ],
          },
        },
        select: { id: true },
      });

      if (!environment) {
        return res
          .status(403)
          .json({ error: "Unauthorized access or environment not found." });
      }

      await db.$transaction(async (tx) => {
        // Set all rules to temporary negative orders to avoid conflicts
        await Promise.all(
          ruleIdsInNewOrder.map((ruleId: string, index: number) =>
            tx.environmentRule.update({
              where: {
                id: ruleId,
                flagId,
                environmentId: environment.id,
              },
              data: { order: -(index + 1) },
            })
          )
        );

        // Set final positive orders
        await Promise.all(
          ruleIdsInNewOrder.map((ruleId: string, index: number) =>
            tx.environmentRule.update({
              where: {
                id: ruleId,
                flagId,
                environmentId: environment.id,
              },
              data: { order: index },
            })
          )
        );
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(
        `Failed to reorder rules for flag ${flagId} in ${environmentName}:`,
        error
      );
      res.status(500).json({ error: "Failed to save rule order." });
    }
  }
);

router.put(
  "/:flagId/rules/:ruleId",
  async (req: RequestWithSession, res: Response) => {
    if (!req.session) {
      return res.status(401).json({ error: "unauthenticated" });
    }

    const userId = req.session.user.id;
    const { flagId, ruleId } = req.params;
    const { environmentName, projectId, rule } = req.body;

    if (!environmentName || !projectId || !rule.description || !rule.ruleType) {
      return res
        .status(400)
        .json({ error: "Missing required rule parameters." });
    }

    try {
      const environment = await db.environment.findFirst({
        where: {
          projectId,
          name: environmentName,
          project: {
            OR: [{ ownerId: userId }, { members: { some: { userId } } }],
          },
        },
        select: { id: true },
      });

      if (!environment) {
        return res
          .status(403)
          .json({ error: "Unauthorized access or environment not found." });
      }

      let variationId: string | undefined;
      let distributionData: string | typeof Prisma.JsonNull = Prisma.JsonNull;
      let rolloutPercentage: number | undefined;

      if (rule.ruleType === "targeting") {
        const targetVariation = await db.variation.findFirst({
          where: { flagId, name: rule.targetVariation },
          select: { id: true },
        });
        if (!targetVariation) {
          return res.status(400).json({
            error: `Target variation '${rule.targetVariation}' not found.`,
          });
        }
        variationId = targetVariation.id;
        rolloutPercentage = rule.rolloutPercentage;
      } else {
        // experiment
        distributionData = JSON.stringify(rule.variationSplits);
      }

      await db.environmentRule.update({
        where: { id: ruleId },
        data: {
          description: rule.description,
          conditions:
            rule.conditions.length > 0
              ? JSON.stringify(rule.conditions)
              : Prisma.JsonNull,
          rolloutPercentage: rolloutPercentage ?? null,
          variationId: variationId ?? null,
          distribution: distributionData,
        },
        select: { id: true },
      });

      await db.activityLog.create({
        data: {
          projectId,
          userId,
          actionType: "FLAG_RULE_UPDATED",
          description: `Updated rule ID ${ruleId} ('${rule.description}') for flag ${flagId} in ${environmentName}.`,
          environmentName,
          details: {
            ruleId,
            ruleType: rule.ruleType,
            conditions: rule.conditions,
          },
        },
      });

      const updatedRule = {
        id: ruleId,
        description: rule.description,
        ruleType: rule.ruleType,
        conditions: rule.conditions,
        targetVariation: rule.targetVariation || undefined,
        rolloutPercentage: rule.rolloutPercentage || undefined,
        variationSplits: rule.variationSplits || undefined,
      };

      res.json(updatedRule);
    } catch (error) {
      console.error(
        `Failed to update rule ${ruleId} for flag ${flagId}:`,
        error
      );
      res.status(500).json({ error: "Failed to save targeting rule." });
    }
  }
);

router.delete(
  "/:flagId/rules/:ruleId",
  async (req: RequestWithSession, res: Response) => {
    if (!req.session) {
      return res.status(401).json({ error: "unauthenticated" });
    }

    const userId = req.session.user.id;
    const { flagId, ruleId } = req.params;

    try {
      let deletedRuleOrder: number;
      let environmentId: string;

      await db.$transaction(async (tx) => {
        const ruleToDelete = await tx.environmentRule.findUnique({
          where: { id: ruleId, flagId },
          select: {
            order: true,
            description: true,
            environmentId: true,
            environment: {
              select: {
                name: true,
                projectId: true,
              },
            },
          },
        });

        if (!ruleToDelete) {
          throw new Error("Rule not found or does not belong to this flag.");
        }

        deletedRuleOrder = ruleToDelete.order;
        environmentId = ruleToDelete.environmentId;
        const projectId = ruleToDelete.environment.projectId;
        const environmentName = ruleToDelete.environment.name;
        const deletedRuleDescription = ruleToDelete.description;

        await tx.environmentRule.delete({
          where: { id: ruleId },
        });

        await tx.activityLog.create({
          data: {
            projectId,
            userId,
            actionType: "FLAG_RULE_DELETED",
            description: `Deleted rule ID ${req.params.ruleId}: '${deletedRuleDescription}' for flag ${flagId}.`,
            environmentName,
            details: {
              ruleId: req.params.ruleId,
              description: deletedRuleDescription,
            },
          },
        });

        // Decrement the order of all rules that were below the deleted rule
        // This maintains the correct sequential order
        await tx.environmentRule.updateMany({
          where: {
            flagId,
            environmentId,
            order: { gt: deletedRuleOrder },
          },
          data: { order: { decrement: 1 } },
        });
      });

      res.json({ success: true, ruleId });
    } catch (error) {
      console.error(
        `Failed to delete rule ${ruleId} for flag ${flagId}:`,
        error
      );
      res.status(500).json({ error: "Failed to delete targeting rule." });
    }
  }
);

router.put(
  "/:flagId/metadata",
  async (req: RequestWithSession, res: Response) => {
    if (!req.session) {
      return res.status(401).json({ error: "unauthenticated" });
    }

    const userId = req.session.user.id;
    const { flagId } = req.params;
    const { projectId, newKey, newDescription } = req.body;

    if (!projectId || !newKey || !newDescription) {
      return res
        .status(400)
        .json({ error: "Missing required metadata parameters." });
    }

    try {
      const flag = await db.flag.findUnique({
        where: {
          id: flagId,
          projectId,
          project: {
            OR: [{ ownerId: userId }, { members: { some: { userId } } }],
          },
        },
        select: { id: true },
      });

      if (!flag) {
        return res
          .status(403)
          .json({ error: "Unauthorized access or flag not found." });
      }

      // Check for key uniqueness if the key is being changed
      const existingFlagWithNewKey = await db.flag.findFirst({
        where: {
          key: newKey,
          projectId,
          NOT: { id: flagId }, // Exclude the current flag itself
        },
      });

      if (existingFlagWithNewKey) {
        return res.status(409).json({
          error: `Flag key '${newKey}' already exists in this project.`,
        });
      }

      const currentFlag = await db.flag.findUnique({
        where: { id: flagId },
        select: { key: true, description: true },
      });

      if (!currentFlag) {
        return res.status(409).json({
          error: "Flag does not exist",
        });
      }

      const updatedFlag = await db.flag.update({
        where: { id: flagId },
        data: {
          key: newKey,
          description: newDescription,
        },
        select: { key: true, description: true },
      });

      await db.activityLog.create({
        data: {
          projectId,
          userId,
          actionType: "FLAG_METADATA_UPDATED",
          description: `Flag metadata updated. Key changed from '${currentFlag.key}' to '${newKey}'.`,
          details: {
            oldKey: currentFlag.key,
            newKey,
            oldDescription: currentFlag.description,
            newDescription,
          },
        },
      });

      res.json({
        success: true,
        newKey: updatedFlag.key,
        newDescription: updatedFlag.description,
      });
    } catch (error) {
      console.error(`Failed to update metadata for flag ${flagId}:`, error);
      res.status(500).json({ error: "Failed to update flag metadata." });
    }
  }
);

router.delete("/:flagId", async (req: RequestWithSession, res: Response) => {
  if (!req.session) {
    return res.status(401).json({ error: "unauthenticated" });
  }

  const userId = req.session.user.id;
  const { flagId } = req.params;

  try {
    const flagToDelete = await db.flag.findUnique({
      where: {
        id: flagId,
        project: {
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
      },
      select: {
        id: true,
        key: true,
        projectId: true,
      },
    });

    if (!flagToDelete) {
      return res.status(404).json({ error: "Flag not found or unauthorized." });
    }

    const { key: flagKey, projectId } = flagToDelete;

    await db.activityLog.create({
      data: {
        projectId,
        userId,
        actionType: "FLAG_DELETED",
        description: `Feature flag '${flagKey}' deleted.`,
        details: { flagId, flagKey },
      },
    });

    await db.flag.delete({
      where: { id: flagId },
    });

    res.json({ success: true, flagId });
  } catch (error) {
    console.error(`Failed to delete flag ${flagId}:`, error);

    res.status(500).json({ error: "Failed to delete the feature flag." });
  }
});

export default router;
