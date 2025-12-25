"use client";

import { Button } from "@flagix/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@flagix/ui/components/dropdown-menu";
import { Bell } from "lucide-react";

export const NotificationsPopover = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button aria-label="Notifications" size="icon">
        <Bell className="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-80">
      <div className="p-4">
        <h4 className="mb-2 font-semibold text-gray-900">Notifications</h4>

        <div className="rounded-lg border-2 border-gray-200 border-dashed py-8 text-center text-gray-500 text-sm">
          Your notifications would appear here.
        </div>
      </div>
      <DropdownMenuSeparator />

      <DropdownMenuItem asChild>
        <div className="flex w-full justify-center py-2 font-medium text-[#1D2138] text-sm hover:bg-gray-50">
          View All Notifications{" "}
          <span className="ml-2 text-xs">(coming soon)</span>
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
