"use client";

import { cn } from "@flagix/ui/lib/utils";

export const Button = ({
  variant = "default",
  size = "default",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost";
  size?: "default" | "icon";
}) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors",
      "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
      variant === "ghost" && "hover:bg-gray-100",
      size === "icon" && "h-9 w-9",
      className
    )}
    {...props}
  />
);
