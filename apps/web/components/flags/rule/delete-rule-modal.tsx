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

type DeleteRuleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  ruleDescription: string;
  isSubmitting: boolean;
};

export function DeleteRuleModal({
  isOpen,
  onClose,
  onConfirmDelete,
  ruleDescription,
  isSubmitting,
}: DeleteRuleModalProps) {
  const handleConfirm = () => {
    if (!isSubmitting) {
      onConfirmDelete();
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Targeting Rule</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          You are about to permanently delete the following rule:
          <p className="mt-2 rounded-md bg-[#F2F2F2] p-2 font-mono text-gray-800 text-sm">
            {ruleDescription}
          </p>
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
            className="rounded-lg bg-red-100 px-4 py-2 text-red-700 text-sm hover:bg-red-200 disabled:cursor-not-allowed"
            disabled={isSubmitting}
            onClick={handleConfirm}
            variant="ghost"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Delete Rule"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
