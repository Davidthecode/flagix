export const getProjectRoutes = (projectId: string) => [
  { href: `/projects/${projectId}/flags`, label: "Flags" },
  { href: `/projects/${projectId}/environments`, label: "Environments" },
  { href: `/projects/${projectId}/analytics`, label: "Analytics" },
  { href: `/projects/${projectId}/audit`, label: "Audit Log" },
  { href: `/projects/${projectId}/settings`, label: "Settings" },
];
