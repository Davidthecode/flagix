import { Nav } from "@/components/nav/nav-client";
import { ProjectProvider } from "@/providers/project";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: ProjectLayoutProps) {
  return (
    <ProjectProvider>
      <div className="flex min-h-screen flex-col">
        <Nav />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </ProjectProvider>
  );
}
