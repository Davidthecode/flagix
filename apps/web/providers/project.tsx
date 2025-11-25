"use client";

import { useParams } from "next/navigation";
import { createContext, useContext } from "react";

interface ProjectContextType {
  projectId: string;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const params = useParams<{ project: string }>();

  const projectId = Array.isArray(params.project)
    ? params.project[0]
    : params.project;

  return (
    <ProjectContext.Provider value={{ projectId }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within ProjectProvider");
  }
  return context;
};
