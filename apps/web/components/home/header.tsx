"use client";

import { Button } from "@flagix/ui/components/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import FlagixLogo from "@/public/icon.png";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const mobileNavLinkClasses = "transition-colors hover:text-gray-900 py-1";

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl">
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

        <div className="flex items-center space-x-4">
          <div className="hidden items-center space-x-4 sm:flex">
            <a
              className="font-medium text-gray-900 transition hover:opacity-70 dark:text-white"
              href="https://github.com/davidthecode/flagix"
              rel="noopener"
              target="_blank"
            >
              Github
            </a>
            <a
              className="font-medium text-gray-900 transition hover:opacity-70 dark:text-white"
              href="#features"
            >
              Features
            </a>
            <a
              className="font-medium text-gray-900 transition hover:opacity-70 dark:text-white"
              href="https://docs.flagix.com"
              rel="noopener"
              target="_blank"
            >
              Docs
            </a>

            <Link
              className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white shadow-md transition hover:bg-black dark:bg-white dark:text-black"
              href="/login"
            >
              Get Started
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
        <div className="absolute top-16 left-0 w-full border-gray-300/90 border-b bg-[#F5F6F5]/95 backdrop-blur-xl sm:hidden dark:bg-black/90">
          <nav className="flex flex-col space-y-1 p-6 font-medium text-gray-600 dark:text-gray-400">
            <Link
              className={`${mobileNavLinkClasses} rounded-md px-2 py-3 transition-all hover:bg-gray-200/50`}
              href="#features"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              className={`${mobileNavLinkClasses} rounded-md px-2 py-3 transition-all hover:bg-gray-200/50`}
              href="https://docs.flagix.com"
              onClick={() => setIsOpen(false)}
              target="_blank"
            >
              Docs
            </Link>
            <a
              className={`${mobileNavLinkClasses} rounded-md px-2 py-3 transition-all hover:bg-gray-200/50`}
              href="https://github.com/davidthecode/flagix"
              rel="noopener"
              target="_blank"
            >
              Github
            </a>

            <div className="pt-4">
              <Link
                className="block w-full rounded-full bg-gray-900 py-4 text-center font-bold text-white shadow-lg transition-transform active:scale-[0.98] dark:bg-white dark:text-black"
                href="/login"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
