import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import FlagixLogo from "@/public/icon.png";

export const metadata: Metadata = {
  title: "Login - Flagix",
  description: "Log in to your Flagix dashboard",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F4F4F5] p-4 sm:p-6">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #D4D4D8 1px, transparent 1px), linear-gradient(to bottom, #D4D4D8 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="mask-[radial-gradient(ellipse_at_center,transparent_0%,black_80%)] absolute inset-0 bg-[#F4F4F5]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex flex-col items-center">
          <Link href="/">
            <Image
              alt="flagix logo"
              className="rounded-sm"
              height={40}
              src={FlagixLogo}
              width={40}
            />
          </Link>
          <p className="mt-4 font-semibold text-gray-600 text-xs uppercase tracking-widest dark:text-gray-400">
            Control Your Features. Ship Faster.
          </p>

          <div className="mt-2 w-20 border border-t" />
        </div>
        <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
          <Suspense>
            <LoginForm />
          </Suspense>

          <div className="mt-8 text-center text-gray-500 text-xs">
            <p>
              By continuing, you agree to our{" "}
              <a
                className="font-medium text-gray-700 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                href="/terms"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                className="font-medium text-gray-700 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                href="/privacy"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>
          Need help or experiencing issues?{" "}
          <a
            className="font-medium text-gray-700 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            href="mailto:flagixsupport@gmail.com"
          >
            Email us at flagixsupport@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
