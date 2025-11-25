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
import { type ChangeEvent, useState } from "react";

type CreateEnvironmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isSubmitting: boolean;
};

const ENVIRONMENT_NAME_REGEX = /^[a-z0-9-]+$/;

export function CreateEnvironmentModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateEnvironmentModalProps) {
  const [environmentName, setEnvironmentName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEnvironmentNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEnvironmentName(value);
    if (value && !ENVIRONMENT_NAME_REGEX.test(value)) {
      setError(
        "Name must be lowercase, alphanumeric, and can contain hyphens."
      );
    } else {
      setError(null);
    }
  };

  const handleSubmit = () => {
    if (environmentName && !error && !isSubmitting) {
      onSubmit(environmentName);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEnvironmentName("");
      setError(null);
      onClose();
    }
  };

  const isFormValid = environmentName.length > 0 && !error;

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Environment</DialogTitle>
          <DialogDescription>
            Give your new environment a unique, descriptive name.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <label
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="env-name"
            >
              Environment Name
            </label>
            <Input
              id="env-name"
              onChange={handleEnvironmentNameChange}
              placeholder="e.g., qa, feature-branch"
              value={environmentName}
            />
            {error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            className="border border-gray-300 p-2 text-gray-700 text-sm hover:bg-gray-100"
            disabled={isSubmitting}
            onClick={onClose}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:cursor-not-allowed"
            disabled={!isFormValid || isSubmitting}
            onClick={handleSubmit}
            variant="default"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create Environment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
