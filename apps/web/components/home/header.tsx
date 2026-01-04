"use client";

import { Button } from "@flagix/ui/components/button";
import { Github, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import FlagixLogo from "@/public/icon.png";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const mobileNavLinkClasses =
    "transition-colors hover:text-gray-900 dark:hover:text-white py-1";

  return (
    <header className="sticky top-0 z-50 w-full border-white/10 border-b bg-[#F4F4F5] backdrop-blur-xl dark:bg-black/70">
      <div className="container-landing mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <Image
            alt="flagix logo"
            className="rounded-sm"
            height={24}
            src={FlagixLogo}
            width={24}
          />
          <span className="font-bold text-gray-900 text-xl dark:text-white">
            Flagix
          </span>
        </div>

        <nav className="hidden space-x-8 font-medium text-gray-600 text-sm sm:flex dark:text-gray-400">
          <a
            className="transition hover:text-gray-900 dark:hover:text-white"
            href="#features"
          >
            Features
          </a>
          <a
            className="transition hover:text-gray-900 dark:hover:text-white"
            href="#pricing"
          >
            Pricing
          </a>
          <a
            className="transition hover:text-gray-900 dark:hover:text-white"
            href="https://docs.flagix.com"
            rel="noopener"
            target="_blank"
          >
            Docs
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden items-center space-x-4 sm:flex">
            <a
              className="flex items-center space-x-1.5 font-medium text-gray-700 text-sm transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              href="https://github.com/davidthecode/flagix"
              rel="noopener"
              target="_blank"
            >
              <Github className="h-4 w-4" />
            </a>
            <Link
              className="font-medium text-gray-700 text-sm dark:text-gray-300"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white shadow-md transition hover:bg-black dark:bg-white dark:text-black"
              href="/login"
            >
              Start for Free
            </Link>
          </div>

          <Button className="sm:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X className="text-black dark:text-white" />
            ) : (
              <Menu className="text-black dark:text-white" />
            )}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full border-white/10 border-b bg-white p-6 shadow-xl sm:hidden dark:bg-[#09090b]">
          <nav className="flex flex-col space-y-4 font-medium text-gray-600 dark:text-gray-400">
            <Link
              className={mobileNavLinkClasses}
              href="#features"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              className={mobileNavLinkClasses}
              href="#pricing"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              className={mobileNavLinkClasses}
              href="https://docs.flagix.com"
              onClick={() => setIsOpen(false)}
              rel="noopener"
              target="_blank"
            >
              Docs
            </Link>

            <hr className="border-gray-100 dark:border-white/5" />

            <Link
              className="py-2 text-gray-900 transition-colors hover:opacity-70 dark:text-white"
              href="/login"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              className="rounded-lg bg-gray-900 py-3 text-center text-white transition-transform active:scale-95 dark:bg-white dark:text-black"
              href="/login"
              onClick={() => setIsOpen(false)}
            >
              Start for Free
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
