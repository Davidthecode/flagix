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

interface DeleteFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  flagKey: string;
  onConfirmDelete: (flagKey: string) => void;
  isSubmitting: boolean;
}

export function DeleteFlagModal({
  isOpen,
  onClose,
  flagKey,
  onConfirmDelete,
  isSubmitting,
}: DeleteFlagModalProps) {
  const [confirmationInput, setConfirmationInput] = useState("");

  const handleConfirm = () => {
    if (confirmationInput === flagKey) {
      onConfirmDelete(flagKey);
      setConfirmationInput("");
    }
  };

  const isConfirmationValid = confirmationInput === flagKey;

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Flag</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          All data related to this flag, **{flagKey}**, will be deleted
          permanently.
        </DialogDescription>

        <p className="font-semibold text-red-600 text-sm">
          This action cannot be undone.
        </p>

        <div className="py-4">
          <label className="mb-2 block text-sm" htmlFor="delete-confirm">
            Please type{" "}
            <span className="font-mono font-semibold">{flagKey}</span> to
            confirm.
          </label>
          <Input
            className="font-mono"
            id="delete-confirm"
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder={flagKey}
            value={confirmationInput}
          />
        </div>

        <DialogFooter>
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
            disabled={!isConfirmationValid || isSubmitting}
            onClick={handleConfirm}
            variant="ghost"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
