"use client";

import { Button } from "@flagix/ui/components/button";
import { Input } from "@flagix/ui/components/input";
import { Spinner } from "@flagix/ui/components/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { ProjectSection } from "@/components/dashboard/project-section";
import { CreateProjectModal } from "@/components/project/project-create-modal";
import { api } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queries/keys";
import type { Project } from "@/types/project";

export const ProjectList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [starringId, setStarringId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const {
    data: projects = [],
    isLoading,
    isFetching,
  } = useQuery<Project[]>({
    queryKey: QUERY_KEYS.PROJECTS,
    queryFn: () => api.get("/api/projects").then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      api.post("/api/projects", data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
      setIsModalOpen(false);
    },
  });

  const starMutation = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/api/projects/${id}/star`).then((res) => res.data),

    onMutate: async (projectIdToStar) => {
      setStarringId(projectIdToStar);

      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.PROJECTS });
      const previousProjects = queryClient.getQueryData<Project[]>(
        QUERY_KEYS.PROJECTS
      );

      queryClient.setQueryData<Project[]>(QUERY_KEYS.PROJECTS, (old) =>
        old?.map((p) =>
          p.id === projectIdToStar ? { ...p, isFavorite: !p.isFavorite } : p
        )
      );

      return { previousProjects };
    },

    onError: (_error, _newProject, context) => {
      setStarringId(null);
      if (context?.previousProjects) {
        queryClient.setQueryData(QUERY_KEYS.PROJECTS, context.previousProjects);
      }
    },

    onSettled: () => {
      setStarringId(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
    },
  });

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  const isListLoading = isLoading || isFetching;

  const starredProjects = filtered.filter((p) => p.isFavorite);
  const regularProjects = filtered.filter((p) => !p.isFavorite);

  const handleStarClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (starringId === id) {
      return;
    }
    starMutation.mutate(id);
  };

  const handleCreateProject = (name: string, description: string) => {
    createMutation.mutate({ name, description });
  };

  return (
    <div className="container-wrapper w-full px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="relative w-80">
          <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
          <Input
            className="h-10 w-full rounded-lg border-gray-200 bg-white pr-4 pl-10 text-sm transition-shadow placeholder:text-gray-400 focus:border-[#1D2138] focus:ring-2 focus:ring-[#1D2138]/20"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            value={search}
          />
        </div>

        <Button
          className="flex bg-emerald-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-emerald-70"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>

      {isListLoading && (
        <div className="flex flex-col items-center py-16">
          <Spinner className="text-emerald-600" size={32} />
          <p className="mt-4 text-gray-600 text-sm">Loading projects...</p>
        </div>
      )}

      {!isListLoading && (
        <>
          {starredProjects.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-3 px-1 font-medium text-gray-400 text-xs uppercase tracking-wide">
                Starred
              </h3>

              <ProjectSection
                onStarClick={handleStarClick}
                projects={starredProjects}
                starringId={starringId}
              />
            </div>
          )}

          {regularProjects.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-3 px-1 font-medium text-gray-400 text-xs uppercase tracking-wide">
                Projects
              </h3>

              <ProjectSection
                onStarClick={handleStarClick}
                projects={regularProjects}
                starringId={starringId}
              />
            </div>
          )}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mb-4 text-gray-600 text-sm">
                No projects match your search
              </p>
              <Button
                className="flex bg-emerald-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-emerald-70"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          )}
        </>
      )}

      <CreateProjectModal
        isSubmitting={createMutation.isPending}
        onCreate={handleCreateProject}
        onOpenChange={setIsModalOpen}
        open={isModalOpen}
      />
    </div>
  );
};
