"use client";

import { ProjectList } from "@/components/dashboard/project-list";
import { ProjectMetrics } from "@/components/dashboard/project-metrics";

export default function DashboardClient() {
  return (
    <div>
      <ProjectMetrics />
      <ProjectList />
    </div>
  );
}
