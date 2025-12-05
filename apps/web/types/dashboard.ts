export type DashboardMetric = {
  title: string;
  value: string | number;
  description: string;
  actionLink: {
    label: string;
    href: string;
  };
};

export type DashboardActivityLog = {
  id: string;
  time: string;
  description: string;
};

export type DashboardData = {
  metrics: {
    totalFlags: number;
    environmentsCount: number;
    targetingRules: number;
    evaluations: number;
  };
  environments: Array<{
    name: string;
    apiKey: string;
    lastSeenAt: Date | null;
  }>;
  recentActivity: DashboardActivityLog[];
};
