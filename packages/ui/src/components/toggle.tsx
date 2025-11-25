"use client";
import { Button } from "@flagix/ui/components/button";

interface ToggleProps {
  checked: boolean;
  onChange: (newState: boolean) => void;
  disabled?: boolean;
}

function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  return (
    <Button
      className={`relative h-5 w-10 rounded-full transition-colors duration-200 ${checked ? "bg-[#15A34A]" : "bg-gray-300"}
    ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
  `}
      onClick={() => !disabled && onChange(!checked)}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}
    `}
      />
    </Button>
  );
}

export { Toggle };
