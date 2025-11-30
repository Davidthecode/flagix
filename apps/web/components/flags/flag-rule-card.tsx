"use client";

import { Button } from "@flagix/ui/components/button";
import { Edit, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteRuleModal } from "@/components/flags/rule/delete-rule-modal";
import type { TargetingRule } from "@/types/flag";

export function FlagRuleCard({
  rule,
  isEditable,
  onEdit,
  onDelete,
  isDeleting,
  dragHandleProps,
}: {
  rule: TargetingRule;
  isEditable: boolean;
  onEdit: (rule: TargetingRule) => void;
  onDelete: (ruleId: string, onSuccess?: () => void) => void;
  isDeleting: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement> & {
    role?: string;
    "aria-pressed"?: boolean;
    "aria-roledescription"?: string;
    "aria-describedby"?: string;
  };
}) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const targetVariation =
    rule.ruleType === "experiment"
      ? `A/B Test (${rule.variationSplits?.map((s) => `${s.variation}: ${s.percentage}%`).join(", ")})`
      : rule.targetVariation;

  const rollout =
    rule.ruleType === "experiment"
      ? "Random split"
      : `${rule.rolloutPercentage}`;

  const handleConfirmDelete = () => {
    if (rule.id) {
      onDelete(rule.id, () => {
        setIsDeleteConfirmOpen(false);
      });
    }
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="font-medium text-gray-900">{rule.description}</div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-gray-500">Target:</span>
                <span className="ml-2 rounded bg-emerald-50 px-2 py-0.5 font-mono text-emerald-700">
                  {targetVariation}
                </span>
              </div>

              <div>
                <span className="text-gray-500">Rollout:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {rollout === "Split" ? "Split" : `${rollout}%`}
                </span>
              </div>
            </div>

            <div className="text-sm">
              <span className="text-gray-500">Conditions:</span>
              {rule.conditions.length === 0 ? (
                <div className="mt-1 text-gray-600 italic">Always serve</div>
              ) : (
                <ul className="mt-1 space-y-1">
                  {rule.conditions.map((c) => (
                    <li
                      className="rounded border border-gray-200 bg-[#F2F2F2] px-3 py-1.5 font-mono text-gray-700 text-xs"
                      key={c.id}
                    >
                      {c.attribute} {c.operator} {c.value}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex space-x-1">
            {isEditable && (
              <Button
                className={`text-gray-400 hover:text-gray-600 ${isEditable ? "cursor-grab" : "cursor-default"}`}
                disabled={!isEditable}
                {...dragHandleProps}
                size="icon"
                variant="ghost"
              >
                <GripVertical className="h-5 w-5" />
              </Button>
            )}
            <Button
              className="text-gray-400 hover:text-gray-600 disabled:opacity-40"
              disabled={!isEditable}
              onClick={() => onEdit(rule)}
              size="icon"
              variant="ghost"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              className="text-red-400 hover:text-red-600 disabled:opacity-40"
              disabled={!isEditable || isDeleting}
              onClick={() => setIsDeleteConfirmOpen(true)}
              size="icon"
              variant="ghost"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <DeleteRuleModal
        isOpen={isDeleteConfirmOpen}
        isSubmitting={isDeleting}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        ruleDescription={rule.description}
      />
    </>
  );
}
