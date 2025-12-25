"use client";

import { Avatar, AvatarFallback } from "@flagix/ui/components/avatar";
import { Button } from "@flagix/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@flagix/ui/components/dropdown-menu";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FeedbackModal } from "@/components/feedback/feedback-modal";
import { NotificationsPopover } from "@/components/notifications/notifications-popover";
import { useAuth } from "@/hooks/use-auth";
import { useProject } from "@/providers/project";
import FlagixLogo from "@/public/icon.png";
import { getProjectRoutes } from "@/utils/project";

export const Nav = () => {
  const { projectId } = useProject();
  const isProjectRoute = Boolean(projectId);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const projectRoutes = projectId ? getProjectRoutes(projectId) : [];
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b bg-[#18181B] text-white">
      <div className="container-wrapper flex h-20 items-center justify-between">
        <Link className="flex w-fit items-center gap-2" href="/dashboard">
          <div className="flex items-center space-x-3">
            <Image
              alt="flagix logo"
              className="rounded-sm"
              height={28}
              src={FlagixLogo}
              width={28}
            />
            <span className="font-semibold text-lg">Flagix</span>
          </div>
        </Link>

        {/* Desktop Nav  */}
        {isProjectRoute && projectRoutes.length > 0 && (
          <nav className="hidden items-center gap-1 rounded-lg border border-white/10 px-1 py-2 md:flex">
            {projectRoutes.map((r) => (
              <Link
                className={`rounded-md px-4 py-1 font-medium text-sm transition-all ${
                  isActive(r.href)
                    ? "bg-white text-black"
                    : "hover:brightness-110"
                }`}
                href={r.href}
                key={r.href}
              >
                {r.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <NotificationsPopover />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full" size="icon" variant="ghost">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                    {user?.name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col space-y-1 p-2">
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-gray-500 text-xs">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsFeedbackModalOpen(true)}
              >
                Submit Feedback
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile */}
          <Button
            className="md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            size="icon"
            variant="ghost"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && isProjectRoute && (
        <nav className="border-t p-4 md:hidden">
          {projectRoutes.map((r) => (
            <Link
              className={`block rounded-md px-3 py-2 font-medium text-sm transition-all ${
                isActive(r.href)
                  ? "bg-white text-black"
                  : "bg-[#18181B] text-white"
              }`}
              href={r.href}
              key={r.href}
              onClick={() => setMobileMenuOpen(false)}
            >
              {r.label}
            </Link>
          ))}
        </nav>
      )}

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </header>
  );
};
