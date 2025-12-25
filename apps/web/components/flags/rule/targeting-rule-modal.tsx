"use client";

import { Button } from "@flagix/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@flagix/ui/components/dialog";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ConditionsBuilder } from "@/components/flags/rule/conditions-builder";
import { DescriptionInput } from "@/components/flags/rule/description-input";
import { ExperimentConfig } from "@/components/flags/rule/experiment-config";
import { RuleTypeSelector } from "@/components/flags/rule/rule-type-selector";
import { TargetingConfig } from "@/components/flags/rule/targeting-config";
import type {
  Condition,
  FlagVariation,
  OldVariationSplit,
  TargetingRule,
  VariationSplit,
} from "@/types/flag";

interface TargetingRuleModalProps {
  isOpen: boolean;
  rule?: TargetingRule | null;
  availableVariations: FlagVariation[];
  onClose: () => void;
  onSave: (rule: TargetingRule) => void;
  isSubmitting: boolean;
}

export const TargetingRuleModal = ({
  isOpen,
  rule: editingRule,
  availableVariations,
  onClose,
  onSave,
  isSubmitting,
}: TargetingRuleModalProps) => {
  const isEdit = !!editingRule;

  const [ruleType, setRuleType] = useState<"targeting" | "experiment">(
    "targeting"
  );
  const [description, setDescription] = useState("");
  const [targetVariation, setTargetVariation] = useState("");
  const [rolloutPercentage, setRolloutPercentage] = useState(100);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [variationSplits, setVariationSplits] = useState<VariationSplit[]>([]);
  const [errors, setErrors] = useState<{
    description?: string;
    conditions?: string;
    splits?: string;
  }>({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (editingRule) {
      setRuleType(editingRule.ruleType);
      setDescription(editingRule.description);
      setConditions(editingRule.conditions);
      if (editingRule.ruleType === "targeting") {
        setTargetVariation(
          editingRule.targetVariation ?? availableVariations[0]?.name ?? ""
        );
        setRolloutPercentage(editingRule.rolloutPercentage ?? 100);
      } else {
        const rawSplits = (editingRule.variationSplits ||
          []) as OldVariationSplit[];
        // we do this cause in the past we stored the experiments distribution as
        // {variation and percentage}
        // but now we do -> {variationId and weight}
        const normalizedSplits: VariationSplit[] = rawSplits.map((s) => ({
          variationId:
            s.variationId ||
            availableVariations.find((v) => v.name === s.variation)?.id ||
            "",
          weight: s.weight ?? s.percentage ?? 0,
        }));
        setVariationSplits(normalizedSplits);
      }
    } else {
      setRuleType("targeting");
      setDescription("");
      setTargetVariation(availableVariations[0]?.name ?? "");
      setRolloutPercentage(100);
      setConditions([]);
      setVariationSplits(
        availableVariations.slice(0, 2).map((v) => ({
          variationId: v.id,
          weight: 50,
        }))
      );
    }

    setErrors({});
  }, [isOpen, editingRule, availableVariations]);

  const getTotalSplitWeight = () =>
    variationSplits.reduce((s, v) => s + v.weight, 0);

  const addCondition = () => {
    setConditions([
      ...conditions,
      { id: Date.now().toString(), attribute: "", operator: "==", value: "" },
    ]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const updateCondition = (
    id: string,
    field: keyof Condition,
    value: string
  ) => {
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
    if (errors.conditions) {
      setErrors({ ...errors, conditions: undefined });
    }
  };

  const updateVariationSplitWeight = (index: number, w: number) => {
    const newSplits = [...variationSplits];
    newSplits[index] = {
      ...newSplits[index],
      weight: Math.max(0, Math.min(100, w)),
    };
    setVariationSplits(newSplits);
    if (errors.splits) {
      setErrors({ ...errors, splits: undefined });
    }
  };

  const addVariationSplit = () => {
    const usedIds = variationSplits.map((s) => s.variationId);
    const next = availableVariations.find((v) => !usedIds.includes(v.id));
    if (next) {
      setVariationSplits([
        ...variationSplits,
        { variationId: next.id, weight: 0 },
      ]);
    }
  };

  const removeVariationSplit = (i: number) =>
    variationSplits.length > 2 &&
    setVariationSplits(variationSplits.filter((_, x) => x !== i));

  const updateVariationSplitId = (index: number, id: string) => {
    const newSplits = [...variationSplits];
    newSplits[index] = { ...newSplits[index], variationId: id };
    setVariationSplits(newSplits);
  };

  const validateAndSave = () => {
    const newErrors: typeof errors = {};
    if (!description.trim()) {
      newErrors.description = "Required";
    }

    const incomplete = conditions.filter((c) => !c.attribute || !c.value);
    if (incomplete.length) {
      newErrors.conditions = "Complete all conditions";
    }

    if (ruleType === "experiment" && getTotalSplitWeight() !== 100) {
      newErrors.splits = `Must total 100% (currently ${getTotalSplitWeight()}%)`;
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const saved: TargetingRule = {
      ...(editingRule ?? {}),
      description,
      ruleType,
      conditions: conditions.filter((c) => c.attribute && c.value),
      ...(ruleType === "targeting"
        ? { targetVariation, rolloutPercentage }
        : { variationSplits: variationSplits.filter((s) => s.weight > 0) }),
    };

    onSave(saved);
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  let buttonContent: React.ReactNode;
  if (isSubmitting) {
    buttonContent = <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
  } else if (isEdit) {
    buttonContent = "Save Changes";
  } else {
    buttonContent = "Add Rule";
  }

  return (
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Add"} Targeting Rule</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <RuleTypeSelector
            disabled={isEdit}
            onChange={setRuleType}
            value={ruleType}
          />

          <DescriptionInput
            error={errors.description}
            onChange={setDescription}
            ruleType={ruleType}
            value={description}
          />

          {ruleType === "targeting" && (
            <TargetingConfig
              availableVariations={availableVariations}
              onRolloutChange={setRolloutPercentage}
              onTargetChange={setTargetVariation}
              rolloutPercentage={rolloutPercentage}
              targetVariation={targetVariation}
            />
          )}

          {ruleType === "experiment" && (
            <ExperimentConfig
              availableVariations={availableVariations}
              error={errors.splits}
              onAddSplit={addVariationSplit}
              onRemoveSplit={removeVariationSplit}
              onUpdateSplitWeight={updateVariationSplitWeight}
              onUpdateVariationId={updateVariationSplitId}
              totalPercentage={getTotalSplitWeight()}
              variationSplits={variationSplits}
            />
          )}

          <ConditionsBuilder
            conditions={conditions}
            error={errors.conditions}
            onAdd={addCondition}
            onRemove={removeCondition}
            onUpdate={updateCondition}
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
            className="bg-emerald-600 p-2 text-sm text-white hover:bg-emerald-700"
            disabled={isSubmitting}
            onClick={validateAndSave}
            type="submit"
          >
            {buttonContent}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
