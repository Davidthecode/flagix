import { Nav } from "@/components/nav/nav-client";
import { ProjectProvider } from "@/providers/project";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: ProjectLayoutProps) {
  return (
    <ProjectProvider>
      <Nav />
      {children}
    </ProjectProvider>
  );
}
