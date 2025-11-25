import { ProjectRow } from "@/components/dashboard/project-row";
import type { Project } from "@/types/project";

type ProjectSectionProps = {
  projects: Project[];
  onStarClick: (e: React.MouseEvent, id: string) => void;
  starringId: string | null;
};

export const ProjectSection = ({
  projects,
  onStarClick,
  starringId,
}: ProjectSectionProps) => (
  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
    {projects.map((project) => (
      <ProjectRow
        isStarring={project.id === starringId}
        key={project.id}
        onStarClick={onStarClick}
        project={project}
      />
    ))}
  </div>
);
