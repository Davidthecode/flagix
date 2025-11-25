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
import { Globe, Loader2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function FlagVariationManagementModal({
  variations: initialVariations,
  isOpen,
  onClose,
  onSave,
  isSubmitting,
}) {
  const protectedVariations = useMemo(() => ["on", "off"], []);

  const [localVariations, setLocalVariations] = useState(initialVariations);
  const [selectedType, setSelectedType] = useState("boolean");
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setLocalVariations(initialVariations);
      setSelectedType("boolean");
      setNewName("");
      setNewValue("");
      setError("");
    }
  }, [initialVariations, isOpen]);

  const parseVariationValue = (cleanValue: string, variationType: string) => {
    let parsedValue: string | number | boolean = cleanValue;

    if (variationType === "boolean") {
      const lowerValue = cleanValue.toLowerCase();
      if (lowerValue === "true") {
        parsedValue = true;
      } else if (lowerValue === "false") {
        parsedValue = false;
      } else {
        return { error: "Boolean value must be 'true' or 'false'." };
      }
    } else if (variationType === "number") {
      parsedValue = Number(cleanValue);
      if (Number.isNaN(parsedValue)) {
        return { error: "Please enter a valid number." };
      }
    }

    return { parsedValue };
  };

  const handleAddVariation = () => {
    setError("");

    const cleanName = newName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    const cleanValue = newValue.trim();

    if (!cleanName || !cleanValue) {
      setError("Variation name and value cannot be empty.");
      return;
    }

    if (protectedVariations.includes(cleanName)) {
      setError(
        `Cannot create variation named '${cleanName}'. This name is reserved.`
      );
      return;
    }

    if (localVariations.some((v) => v.name === cleanName)) {
      setError(`Variation name '${cleanName}' already exists.`);
      return;
    }

    const parseResult = parseVariationValue(cleanValue, selectedType);

    if (parseResult.error) {
      setError(parseResult.error);
      return;
    }

    const newVariation = {
      name: cleanName,
      value: parseResult.parsedValue,
      type: selectedType,
    };

    setLocalVariations([...localVariations, newVariation]);
    setNewName("");
    setNewValue("");
  };

  const handleRemoveVariation = (name) => {
    if (protectedVariations.includes(name)) {
      console.error("Cannot remove default variations.");
      return;
    }

    setLocalVariations(localVariations.filter((v) => v.name !== name));
  };

  const handleSave = () => {
    onSave(localVariations);
  };

  const getValueDisplay = (variation) => {
    if (variation.type === "boolean") {
      return `\`${variation.value}\``;
    }
    if (variation.type === "string") {
      return `"${variation.value}"`;
    }
    return variation.value;
  };

  const getPlaceholderText = (type: string) => {
    if (type === "boolean") {
      return "true or false";
    }
    if (type === "number") {
      return "e.g., 42";
    }
    return "e.g., dark-mode";
  };

  const isNewNameProtected = protectedVariations.includes(
    newName.trim().toLowerCase().replace(/\s/g, "-")
  );
  const nameInputError = error.includes("name") || isNewNameProtected;
  const valueInputError =
    error.includes("value") ||
    error.includes("Boolean") ||
    error.includes("number");

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center space-x-2">
              <h1>Manage Flag Variations</h1>
              <div className="border-gray-200">
                <div className="flex w-fit items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-800 text-xs">
                  <Globe className="h-3 w-3" />
                  <span>Global</span>
                </div>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            These variations define the possible values your code will receive.
            They are consistent across all environments.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 rounded-lg border border-gray-200 bg-[#F2F2F2] p-4">
          <h4 className="font-semibold text-gray-800">Add New Variation</h4>

          <fieldset className="border-none">
            <legend className="mb-2 block font-medium text-gray-700 text-xs">
              Variation Type
            </legend>
            <div className="flex gap-2">
              {["boolean", "string", "number"].map((type) => (
                <Button
                  className={`rounded-md px-3 py-1.5 font-medium text-xs transition-colors ${
                    selectedType === type
                      ? "bg-emerald-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setNewValue("");
                    setError("");
                  }}
                  type="button"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </fieldset>

          <div className="flex gap-3">
            <Input
              className="flex-1"
              error={nameInputError}
              onChange={(e) => {
                const val = e.target.value.toLowerCase().replace(/\s/g, "-");
                setNewName(val);
                setError("");
              }}
              placeholder="Variation name"
              value={newName}
            />
            <Input
              className="flex-1"
              error={valueInputError}
              onChange={(e) => {
                setNewValue(e.target.value);
                setError("");
              }}
              placeholder={getPlaceholderText(selectedType)}
              value={newValue}
            />
            <Button
              className="bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
              disabled={
                !newName.trim() || !newValue.trim() || isNewNameProtected
              }
              onClick={handleAddVariation}
            >
              Add
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 text-sm">
            Current Variations
          </h4>
          <div className="max-h-60 space-y-2 overflow-y-auto pr-2">
            {localVariations.map((variation) => {
              const isProtected = protectedVariations.includes(variation.name);

              return (
                <div
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                  key={variation.name}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`min-w-20 font-mono font-semibold text-sm ${
                        isProtected ? "text-gray-900" : "text-emerald-700"
                      }`}
                    >
                      {variation.name}
                    </span>

                    <span className="font-mono text-gray-700 text-sm">
                      Value: {getValueDisplay(variation)}
                    </span>

                    <span
                      className={
                        "rounded-md border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800 text-xs"
                      }
                    >
                      {variation.type}
                    </span>
                  </div>

                  {!isProtected && (
                    <Button
                      className="text-red-400 hover:text-red-600"
                      onClick={() => handleRemoveVariation(variation.name)}
                      size="icon"
                      title="Remove variation"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
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
            className="bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
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
