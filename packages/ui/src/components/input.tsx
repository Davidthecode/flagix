"use client";

import { cn } from "@flagix/ui/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
        "placeholder:text-gray-400",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    />
  );
}

export { Input };
