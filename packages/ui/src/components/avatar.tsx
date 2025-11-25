"use client";

import { cn } from "@flagix/ui/lib/utils";

export const Avatar = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
);
export const AvatarFallback = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gray-100 font-medium text-sm",
      className
    )}
    {...props}
  />
);
