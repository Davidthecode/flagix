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
import { Globe, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type EditFlagDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { newKey: string; newDescription: string }) => void;
  initialKey: string;
  initialDescription: string;
  isSubmitting: boolean;
};

const KEY_REGEX = /^[a-z0-9-]+$/;

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
  const [isKeyValid, setIsKeyValid] = useState(true);

  useEffect(() => {
    setKey(initialKey);
    setDescription(initialDescription);
    setIsKeyValid(true);
  }, [initialKey, initialDescription]);

  const handleSave = () => {
    const trimmedKey = key.trim();
    const trimmedDescription = description.trim();

    if (!trimmedKey) {
      setIsKeyValid(false);
      return;
    }

    onSave({ newKey: trimmedKey, newDescription: trimmedDescription });
  };

  const handleKeyChange = (e) => {
    const newKey = e.target.value;
    const isValid = KEY_REGEX.test(newKey) || newKey === "";
    setKey(newKey);
    setIsKeyValid(isValid);
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
            Update the identifier and description for this feature flag.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Flag Key Input */}
          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="flag-key"
            >
              Flag Key (Identifier)
            </label>
            <Input
              className={
                isKeyValid
                  ? ""
                  : "border-red-500 focus:border-red-500 focus:ring-red-500"
              }
              id="flag-key"
              onChange={handleKeyChange}
              placeholder="e.g., new-checkout-flow"
              value={key}
            />
            {!isKeyValid && (
              <p className="mt-1 text-red-600 text-xs">
                Key is required and should only contain lowercase letters,
                numbers, and hyphens.
              </p>
            )}
            <p className="mt-1 text-gray-500 text-xs">
              Resetting a key invalidates it, so any clients using it must be
              updated to use the new key
            </p>
          </div>

          {/* Description Input */}
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
            className="bg-emerald-600 p-2 text-sm text-white hover:bg-emerald-700"
            disabled={!key.trim() || !isKeyValid || isSubmitting}
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
