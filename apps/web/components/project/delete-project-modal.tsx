"use client";

import { Button } from "@flagix/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@flagix/ui/components/dialog";
import { Input } from "@flagix/ui/components/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { ProjectDetail } from "@/types/project";

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDetail;
  onConfirmDelete: (projectId: string) => void;
  isSubmitting: boolean;
}

export function DeleteProjectModal({
  isOpen,
  onClose,
  project,
  onConfirmDelete,
  isSubmitting,
}: DeleteProjectModalProps) {
  const [confirmationInput, setConfirmationInput] = useState("");
  const projectName = project.name;

  const handleConfirm = () => {
    if (confirmationInput === projectName) {
      onConfirmDelete(project.id);
    }
  };

  const handleModalClose = () => {
    setConfirmationInput("");
    onClose();
  };

  const isConfirmationValid = confirmationInput === projectName;

  return (
    <Dialog onOpenChange={handleModalClose} open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Permanently Delete Project
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          You are about to permanently delete the project **{projectName}** (ID:{" "}
          {project.id}). This will delete all associated flags, variations,
          environments, rules, and activity logs.
        </DialogDescription>

        <p className="font-semibold text-red-600 text-sm">
          This action cannot be undone.
        </p>

        <div className="py-4">
          <label className="mb-2 block text-sm" htmlFor="delete-confirm">
            Please type{" "}
            <span className="font-mono font-semibold">{projectName}</span> to
            confirm deletion.
          </label>
          <Input
            className="font-mono"
            id="delete-confirm"
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder={projectName}
            value={confirmationInput}
          />
        </div>

        <DialogFooter>
          <Button
            className="border border-gray-300 p-2 text-gray-700 text-sm hover:bg-gray-100"
            disabled={isSubmitting}
            onClick={handleModalClose}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
            disabled={!isConfirmationValid || isSubmitting}
            onClick={handleConfirm}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Delete Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
