export const QUERY_KEYS = {
  PROJECTS: ["projects"],
  PROJECT: (id: string) => ["project", id],
  PROJECT_DASHBOARD: (id: string) => ["project-dashboard", id],
  PROJECT_SETTINGS: (projectId: string) => ["project-settings", projectId],

  ENVIRONMENTS: (projectId: string) => ["environments", projectId],

  FLAGS: (projectId: string) => ["flags", projectId],
  FLAG_CONFIG_BASE: ["flag-config"],
  FLAG_CONFIG: (projectId: string, flagKey: string, envName: string) => [
    "flag-config",
    projectId,
    flagKey,
    envName,
  ],

  AUDIT_LOGS: (
    projectId: string,
    environmentName: string | null,
    page: number
  ) => ["audit-logs", projectId, environmentName, page],
};
