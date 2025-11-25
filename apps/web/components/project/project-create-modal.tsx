"use client";

import { Button } from "@flagix/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@flagix/ui/components/dialog";
import { Input } from "@flagix/ui/components/input";
import { Spinner } from "@flagix/ui/components/spinner";
import type React from "react";
import { useState } from "react";

type CreateProjectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, description: string) => void;
  isSubmitting: boolean;
};

export const CreateProjectModal = ({
  open,
  onOpenChange,
  onCreate,
  isSubmitting,
}: CreateProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name, description);
      setName("");
      setDescription("");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setName("");
    setDescription("");
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              className="block font-medium text-gray-700 text-sm"
              htmlFor="projectName"
            >
              Project Name
            </label>
            <Input
              className="h-10 w-full rounded-lg border-gray-200 bg-white pr-4 pl-4 text-sm transition-shadow placeholder:text-gray-400 focus:border-[#1D2138] focus:ring-2 focus:ring-[#1D2138]/20"
              id="projectName"
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website Relaunch"
              required
              value={name}
            />
          </div>

          <div className="space-y-2">
            <label
              className="block font-medium text-gray-700 text-sm"
              htmlFor="projectDescription"
            >
              Description (optional)
            </label>
            <Input
              className="h-10 w-full rounded-lg border-gray-200 bg-white pr-4 pl-4 text-sm transition-shadow placeholder:text-gray-400 focus:border-[#1D2138] focus:ring-2 focus:ring-[#1D2138]/20"
              id="projectDescription"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the project"
              value={description}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 text-sm shadow-sm hover:bg-gray-50"
              disabled={isSubmitting}
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </Button>
            <Button
              className={
                "bg-emerald-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-emerald-70"
              }
              disabled={!name.trim() || isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Spinner className="mr-2 h-4 w-4" />
                  Creating...
                </div>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
