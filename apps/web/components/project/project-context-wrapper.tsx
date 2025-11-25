"use client";

import { Skeleton } from "@flagix/ui/components/skeleton";
import { Spinner } from "@flagix/ui/components/spinner";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queries/keys";
import { CurrentEnvironmentProvider } from "@/providers/environment";
import { FlagProvider } from "@/providers/flag";
import { useProject } from "@/providers/project";
import type { BaseEnvironment } from "@/types/environment";
import { ProjectHeader } from "./project-header";

type ProjectHeaderData = {
  name: string;
  environments: BaseEnvironment[];
};

type ProjectContextWrapperProps = {
  children: React.ReactNode;
};

export const ProjectContextWrapper = ({
  children,
}: ProjectContextWrapperProps) => {
  const { projectId } = useProject();

  const { data, isLoading, isError } = useQuery<ProjectHeaderData>({
    queryKey: QUERY_KEYS.PROJECT(projectId),
    queryFn: () =>
      api.get(`/api/projects/${projectId}`).then((res) => res.data),
    enabled: !!projectId,
  });

  const loading = isLoading || !projectId;

  const isDataReady = !isError && data && (data.environments?.length ?? 0) > 0;

  if (loading || !isDataReady) {
    if (isError) {
      return (
        <div className="container-wrapper px-6 py-8 text-red-600">
          Error loading project data.
        </div>
      );
    }

    const skeletonHeader = (
      <div className="flex flex-col gap-4 border-b pb-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-xl">
            <Skeleton className="h-5 w-5 rounded-sm" />
            <Skeleton className="h-6 w-48" />
          </h1>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
      </div>
    );

    const loadingBody = (
      <div className="flex justify-center py-8">
        <Spinner className="text-emerald-600" size={40} />
      </div>
    );

    return (
      <div className="container-wrapper px-6 py-8">
        {skeletonHeader}
        {loadingBody}
      </div>
    );
  }

  return (
    <CurrentEnvironmentProvider
      initialEnvironments={data.environments}
      projectId={projectId}
    >
      <FlagProvider>
        <div className="container-wrapper px-6 py-8">
          <ProjectHeader
            environments={data.environments}
            projectId={projectId}
            projectName={data.name}
          />
          {children}
        </div>
      </FlagProvider>
    </CurrentEnvironmentProvider>
  );
};
