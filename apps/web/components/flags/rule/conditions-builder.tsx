"use client";

import { Button } from "@flagix/ui/components/button";
import { Input } from "@flagix/ui/components/input";
import { Label } from "@flagix/ui/components/label";
import { AlertCircle, Plus, X } from "lucide-react";

const OPERATORS = [
  { value: "==", label: "equals" },
  { value: "!=", label: "not equals" },
  { value: ">", label: "greater than" },
  { value: ">=", label: "greater than or equal" },
  { value: "<", label: "less than" },
  { value: "<=", label: "less than or equal" },
  { value: "contains", label: "contains" },
  { value: "startsWith", label: "starts with" },
  { value: "endsWith", label: "ends with" },
  { value: "in", label: "in list" },
];

const COMMON_ATTRIBUTES = [
  "user.id",
  "user.email",
  "user.country",
  "user.region",
  "user.plan",
  "user.role",
  "device.type",
  "device.os",
  "app.version",
];

export const ConditionsBuilder = ({
  conditions,
  error,
  onAdd,
  onRemove,
  onUpdate,
}: {
  conditions: {
    id: string;
    attribute: string;
    operator: string;
    value: string;
  }[];
  error?: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (
    id: string,
    field: keyof { attribute: string; operator: string; value: string },
    value: string
  ) => void;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label className="font-medium text-gray-700 text-sm">
        Targeting Conditions{" "}
        <span className="font-normal text-gray-500">(Optional)</span>
      </Label>
      <Button
        className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 font-medium text-emerald-700 text-xs hover:bg-emerald-100"
        onClick={onAdd}
      >
        <Plus size={14} />
        Add Condition
      </Button>
    </div>

    {conditions.length === 0 ? (
      <div className="rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 p-6 text-center">
        <p className="mb-2 font-medium text-gray-700 text-sm">
          No conditions defined
        </p>
        <p className="text-gray-500 text-xs">
          This rule will apply to{" "}
          <span className="font-medium">all traffic</span>.
        </p>
      </div>
    ) : (
      <div className="space-y-2 rounded-lg border border-gray-200 bg-[#F2F2F2] p-3">
        {conditions.map((c) => (
          <div
            className="flex items-start gap-2 rounded-md bg-white p-2 shadow-sm"
            key={c.id}
          >
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    className={error && !c.attribute ? "border-red-500" : ""}
                    list={`attributes-${c.id}`}
                    onChange={(e) =>
                      onUpdate(c.id, "attribute", e.target.value)
                    }
                    placeholder="Attribute (e.g., user.country)"
                    value={c.attribute}
                  />
                  <datalist id={`attributes-${c.id}`}>
                    {COMMON_ATTRIBUTES.map((a) => (
                      <option key={a} value={a} />
                    ))}
                  </datalist>
                </div>
                <select
                  className="w-36 rounded border border-gray-300 bg-white px-2 py-1.5 text-xs"
                  onChange={(e) => onUpdate(c.id, "operator", e.target.value)}
                  value={c.operator}
                >
                  {OPERATORS.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                className={error && !c.value ? "border-red-500" : ""}
                onChange={(e) => onUpdate(c.id, "value", e.target.value)}
                placeholder={
                  c.operator === "in"
                    ? 'Value (e.g., "US", "CA", "UK")'
                    : "Value"
                }
                value={c.value}
              />
            </div>
            <Button
              className="mt-1 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
              onClick={() => onRemove(c.id)}
            >
              <X size={16} />
            </Button>
          </div>
        ))}
        {conditions.length > 1 && (
          <p className="mt-2 text-center text-gray-500 text-xs">
            All conditions must be met (AND logic)
          </p>
        )}
        {error && (
          <div className="flex items-center gap-1 text-red-600 text-xs">
            <AlertCircle size={12} />
            {error}
          </div>
        )}
      </div>
    )}
    <p className="text-gray-500 text-xs">
      Add conditions to target specific users. Leave empty to target all
      traffic.
    </p>
  </div>
);
