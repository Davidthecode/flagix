"use client";

import { Button } from "@flagix/ui/components/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteProjectModal } from "@/components/project/delete-project-modal";
import { useDeleteProject } from "@/lib/queries/project";
import type { ProjectDetail } from "@/types/project";

interface DangerZoneProps {
  projectId: string;
  project: ProjectDetail;
  isOwner: boolean;
}

export const DangerZone = ({
  projectId,
  project,
  isOwner,
}: DangerZoneProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteProject, isPending } = useDeleteProject(projectId);

  const handleDeleteClick = () => {
    if (isOwner) {
      setIsModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    deleteProject(undefined, {
      onSuccess: () => {
        setIsModalOpen(false);
        router.push("/dashboard");
      },
      onError: (error) => {
        console.error("Failed to delete project:", error);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="font-semibold text-lg">Danger Zone</h2>
        <p className="text-gray-600 text-sm">
          Potentially destructive actions for your project.
        </p>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border p-4 md:flex-row md:items-center">
        <div className="flex flex-col space-y-1">
          <h3 className="font-semibold">Delete Project</h3>
          <p className="text-gray-600 text-xs">
            Permanently delete this project and all associated flags,
            environments, and data. This action cannot be undone.
          </p>
          {!isOwner && (
            <p className="mt-1 font-medium text-red-500 text-xs">
              Only the **Project Owner** can delete the project.
            </p>
          )}
        </div>
        <Button
          className="ml-4 flex-shrink-0 bg-red-600 p-2 text-sm text-white hover:bg-red-700 disabled:bg-gray-400"
          disabled={!isOwner || isPending}
          onClick={handleDeleteClick}
        >
          <Trash2 className="mr-1 h-4 w-4" />
          {isPending ? "Deleting..." : "Delete Project"}
        </Button>
      </div>

      <DeleteProjectModal
        isOpen={isModalOpen}
        isSubmitting={isPending}
        onClose={() => setIsModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        project={project}
      />
    </div>
  );
};
