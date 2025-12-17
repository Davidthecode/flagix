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
import { Textarea } from "@flagix/ui/components/textarea";
import { Globe, Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";

type EditFlagDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { newDescription: string }) => void;
  initialKey: string;
  initialDescription: string;
  isSubmitting: boolean;
};

export function EditFlagMetadataModal({
  isOpen,
  onClose,
  onSave,
  initialKey,
  initialDescription,
  isSubmitting,
}: EditFlagDetailsModalProps) {
  const [key, setKey] = useState(initialKey);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setKey(initialKey);
    setDescription(initialDescription);
  }, [initialKey, initialDescription]);

  const handleSave = () => {
    onSave({ newDescription: description.trim() });
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center space-x-2">
              <h1> Edit Flag Metadata</h1>
              <div className="border-gray-200">
                <div className="flex w-fit items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-800 text-xs">
                  <Globe className="h-3 w-3" />
                  <span>Global</span>
                </div>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Update the descriptive details for this feature flag.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label
                className="block font-medium text-gray-700 text-sm"
                htmlFor="flag-key"
              >
                Flag Key (Identifier)
              </label>
              <div className="flex items-center font-bold text-[10px] text-gray-400 uppercase tracking-wider">
                <Lock className="mr-1 h-3 w-3" />
                Immutable
              </div>
            </div>
            <Input
              className="cursor-not-allowed border-gray-200 bg-[#F4F4F5] text-gray-500"
              id="flag-key"
              readOnly
              value={key}
            />
            <p className="mt-2 text-[13px] text-gray-500 text-xs">
              The identifier is permanent. Changing this would disconnect the
              flag from your code and break active rollouts.
            </p>
          </div>

          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="flag-description"
            >
              Description
            </label>
            <Textarea
              id="flag-description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief explanation of what this flag controls."
              value={description}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            className="border border-gray-300 px-4 py-2 text-gray-700 text-sm hover:bg-gray-100"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-emerald-600 px-4 py-2 text-sm text-white shadow-sm transition-colors hover:bg-emerald-700"
            disabled={isSubmitting}
            onClick={handleSave}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
