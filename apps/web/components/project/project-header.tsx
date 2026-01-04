"use client";

import { Button } from "@flagix/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@flagix/ui/components/dropdown-menu";
import { BookOpen, ChevronDown, Folder, Github, Server } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentEnvironment } from "@/providers/environment";
import type { BaseEnvironment } from "@/types/environment";

type ProjectHeaderProps = {
  projectName: string;
  projectId: string;
  environments: BaseEnvironment[];
};

export const ProjectHeader = ({
  projectName,
  projectId,
  environments,
}: ProjectHeaderProps) => {
  const pathname = usePathname();

  const { currentEnvironment, setCurrentEnvironment } = useCurrentEnvironment();

  const isProjectDashboard = pathname === `/projects/${projectId}`;
  const isAuditLogPage = pathname.endsWith("/audit");
  const isEnvironmentPage = pathname.endsWith("/environments");
  const isSettingsPage = pathname.endsWith("/settings");
  const isAnalyticsPage = pathname.endsWith("/analytics");

  const showEnvironmentSelector =
    !isProjectDashboard &&
    !isAuditLogPage &&
    !isSettingsPage &&
    !isAnalyticsPage &&
    !isEnvironmentPage;

  if (!currentEnvironment) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 -mx-6 -mt-8 flex flex-col gap-4 border-b bg-[#F4F4F5] px-6 pt-8 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl">
          <Link href={`/projects/${projectId}`}>
            <Folder className="h-5 w-5" />
          </Link>

          <span className="font-semibold text-gray-800">{projectName}</span>
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-1" variant="default">
              SDK <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuItem>
              <Link
                className="flex items-center"
                href="https://docs.flagix.com"
                target="_blank"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                View Docs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className="flex items-center"
                href="https://github.com/Davidthecode/flagix"
                target="_blank"
              >
                <Github className="mr-2 h-4 w-4" />
                View SDK (GitHub)
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {showEnvironmentSelector && (
        <div className="flex items-center gap-3 text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2" variant="default">
                <Server className="h-4 w-4" />
                {currentEnvironment.name} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {environments.map((env) => (
                <DropdownMenuItem
                  key={env.name}
                  onClick={() => setCurrentEnvironment(env)}
                >
                  {env.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};
