"use client";

import { Button } from "@flagix/ui/components/button";
import { Spinner } from "@flagix/ui/components/spinner";
import { Folder, Star } from "lucide-react";
import Link from "next/link";
import type { Project, ProjectRole } from "@/types/project";
import { roleDisplay } from "@/utils/project";

type ProjectRowProps = {
  project: Project;
  onStarClick: (e: React.MouseEvent, id: string) => void;
  isStarring: boolean;
};

export const ProjectRow = ({
  project,
  onStarClick,
  isStarring,
}: ProjectRowProps) => (
  <div className="group flex items-center gap-4 border-gray-100 border-b bg-white px-6 py-4 transition-colors last:border-b-0 hover:bg-gray-50/50">
    <div
      className={
        "flex h-10 w-10 items-center justify-center rounded-lg bg-[#009965]"
      }
    >
      <Folder className="h-5 w-5 text-white" />
    </div>

    <div className="flex min-w-0 flex-1 items-center gap-8">
      <Link
        className="min-w-0 flex-2"
        href={`/projects/${project.id}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-0.5 font-semibold text-gray-900 text-sm">
          {project.name}
          {!project.isOwner && (
            <span className="ml-3 inline-flex items-center rounded-full bg-[#009965] px-2 py-0.5 font-medium text-white text-xs">
              {roleDisplay[project.userRole as ProjectRole] || "Joined"}
            </span>
          )}
        </div>
        <div className="text-gray-500 text-xs">{project.subtitle}</div>
      </Link>

      <div className="flex-1 text-sm">
        <span className="font-medium text-gray-900">{project.flags}</span>
        <span className="ml-1 text-gray-500">Flags</span>
      </div>

      <div className="flex-1 text-sm">
        <span className="font-medium text-gray-900">
          {project.environments}
        </span>
        <span className="ml-1 text-gray-500">Environments</span>
      </div>

      <div className="flex-1 text-gray-500 text-sm">{project.lastUpdated}</div>
    </div>

    <Button
      aria-label={project.isFavorite ? "Unstar project" : "Star project"}
      className="flex items-center justify-center p-1"
      disabled={isStarring}
      onClick={(e) => onStarClick(e, project.id)}
    >
      {isStarring ? (
        <Spinner className="text-yellow-400" size={20} />
      ) : (
        <Star
          className={`h-5 w-5 transition-colors ${
            project.isFavorite
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-400 hover:text-yellow-400"
          }`}
        />
      )}
    </Button>
  </div>
);
