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
import { Loader2 } from "lucide-react";

type DeleteEnvironmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  environmentName: string;
  isSubmitting: boolean;
};

export function DeleteEnvironmentModal({
  isOpen,
  onClose,
  onConfirmDelete,
  environmentName,
  isSubmitting,
}: DeleteEnvironmentModalProps) {
  const handleConfirm = () => {
    if (!isSubmitting) {
      onConfirmDelete();
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Environment: {environmentName}</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Are you absolutely sure you want to delete the {environmentName}
          environment?{" "}
          <span className="mt-4 font-semibold text-red-600">
            This action cannot be undone. All associated flag states and rules
            for this environment will be permanently removed.
          </span>
        </DialogDescription>

        <DialogFooter className="mt-6">
          <Button
            className="border border-gray-300 p-2 text-gray-700 text-sm hover:bg-gray-100"
            disabled={isSubmitting}
            onClick={onClose}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed"
            disabled={isSubmitting}
            onClick={handleConfirm}
            variant="default"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
