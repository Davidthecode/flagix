"use client";

import { cn } from "@flagix/ui/lib/utils";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type React from "react";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuContent = ({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuContentProps) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      align="end"
      className={cn(
        "z-50 min-w-40 rounded-lg border border-gray-200 bg-white shadow-xl",
        "flex flex-col gap-0.5 p-1.5",
        "data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2 data-[side=right]:slide-in-from-left-2 data-[side=left]:slide-in-from-right-2 data-[state=closed]:animate-out data-[state=open]:animate-in",
        className
      )}
      sideOffset={6}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);

const DropdownMenuItem = ({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuItemProps) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      "flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none",
      "transition-colors duration-150",
      "hover:bg-gray-100 focus:bg-gray-100",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
);

const DropdownMenuLabel = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "px-3 py-2 font-semibold text-gray-500 text-xs tracking-wider",
      className
    )}
    {...props}
  />
);

const DropdownMenuSeparator = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("my-1 h-px bg-gray-200", className)} {...props} />
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
