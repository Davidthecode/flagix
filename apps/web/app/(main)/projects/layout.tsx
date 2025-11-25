import { ProjectContextWrapper } from "@/components/project/project-context-wrapper";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  return (
    <div className="flex-1 bg-[#F4F4F5]">
      <ProjectContextWrapper>{children}</ProjectContextWrapper>
    </div>
  );
}
