"use client";

import { Button } from "@flagix/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@flagix/ui/components/dialog";
import { Input } from "@flagix/ui/components/input";
import { useState } from "react";

type CreateFlagModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (key: string, description: string) => void;
  isSubmitting: boolean;
};

const FLAG_KEY_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const CreateFlagModal = ({
  isOpen,
  onClose,
  onCreate,
  isSubmitting,
}: CreateFlagModalProps) => {
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setKey("");
    setDescription("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleKeyChange = (value: string) => {
    let newKey = value.replace(/\s/g, "-");
    newKey = newKey.toLowerCase();

    setKey(newKey);

    if (error) {
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = key.trim();

    if (!cleanKey) {
      setError("Flag Key is required.");
      return;
    }

    if (!FLAG_KEY_REGEX.test(cleanKey)) {
      setError(
        "Flag Key must be lowercase, hyphenated (kebab-case), and can only contain letters, numbers, and hyphens."
      );
      return;
    }

    setError("");
    onCreate(cleanKey, description.trim());
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
      open={isOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Feature Flag</DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              className="block font-medium text-gray-700 text-sm"
              htmlFor="flag-key"
            >
              Flag Key <span className="text-red-500">*</span>
            </label>
            <Input
              className="w-full border-gray-300"
              id="flag-key"
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder="e.g., new-checkout-flow"
              type="text"
              value={key}
            />
            <p className="text-gray-500 text-xs">
              Must be unique and in kebab-case. Spaces are automatically
              converted to hyphens.
            </p>
            {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
          </div>

          <div className="space-y-2">
            <label
              className="block font-medium text-gray-700 text-sm"
              htmlFor="flag-description"
            >
              Description (Optional)
            </label>
            <Input
              className="w-full border-gray-300"
              id="flag-description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief explanation of the flag's purpose"
              type="text"
              value={description}
            />
          </div>

          <div className="flex justify-end gap-3 border-gray-100 border-t pt-4">
            <Button
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
              onClick={handleClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-emerald-700"
              disabled={!key.trim() || !!error || isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Creating..." : "Create Flag"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
