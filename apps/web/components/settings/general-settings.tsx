"use client";

import { Button } from "@flagix/ui/components/button";
import { Input } from "@flagix/ui/components/input";
import { Label } from "@flagix/ui/components/label";
import { useEffect, useState } from "react";
import { useUpdateProject } from "@/lib/queries/project";
import type { ProjectDetail } from "@/types/project";

interface GeneralSettingsProps {
  project: ProjectDetail;
  isAuthorizedToEdit: boolean;
  projectId: string;
}

export const GeneralSettings = ({
  project,
  isAuthorizedToEdit,
  projectId,
}: GeneralSettingsProps) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");

  const { mutate: updateProject, isPending } = useUpdateProject(projectId);

  useEffect(() => {
    setName(project.name);
    setDescription(project.description || "");
  }, [project.name, project.description]);

  const hasChanges =
    name !== project.name || description !== (project.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges || isPending) {
      return;
    }

    updateProject({ name, description });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-1">
        <h2 className="font-semibold text-gray-900 text-lg">
          General Project Information
        </h2>
        <p className="text-gray-600 text-sm">
          Update the name and description for your project.
        </p>
      </div>

      <div className="max-w-lg space-y-4">
        <div>
          <Label className="mb-1 block font-medium text-gray-700 text-sm">
            Project Name
          </Label>
          <Input
            className="w-full"
            disabled={!isAuthorizedToEdit || isPending}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project Name"
            required
            value={name}
          />
        </div>
        <div>
          <Label className="mb-1 block font-medium text-gray-700 text-sm">
            Project ID (Read-Only)
          </Label>
          <Input
            placeholder="Project ID (Read-Only)"
            readOnly={true}
            value={project.id}
          />
        </div>
        <div>
          <Label className="mb-1 block font-medium text-gray-700 text-sm">
            Description
          </Label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            disabled={!isAuthorizedToEdit || isPending}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of this project."
            rows={3}
            value={description}
          />
        </div>
      </div>

      <div className="border-gray-100 border-t pt-4">
        <Button
          className="flex-shrink-0 bg-emerald-600 p-2 text-sm text-white hover:bg-emerald-700 disabled:bg-gray-400"
          disabled={!hasChanges || isPending || !isAuthorizedToEdit}
          type="submit"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
        {!isAuthorizedToEdit && (
          <p className="mt-2 text-red-500 text-sm">
            You don't have permission to edit general settings.
          </p>
        )}
      </div>
    </form>
  );
};
