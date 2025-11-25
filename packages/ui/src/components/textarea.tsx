"use client";

import { cn } from "@flagix/ui/lib/utils";

interface TextareaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
