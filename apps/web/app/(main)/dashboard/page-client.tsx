"use client";

import { ProjectList } from "@/components/dashboard/project-list";
import { ProjectMetrics } from "@/components/dashboard/project-metrics";

export default function DashboardClient() {
  return (
    <div className="bg-[#F4F4F5]">
      <div className="container-wrapper">
        <ProjectMetrics />
        <ProjectList />
      </div>
    </div>
  );
}
