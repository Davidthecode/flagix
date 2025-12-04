import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import FlagixLogo from "@/public/icon.png";

export const metadata: Metadata = {
  title: "Login - Flagix",
  description: "Log in to your Flagix dashboard",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F4F4F5] p-4 sm:p-6">
      <div className="w-full max-w-md rounded-xl">
        <div className="mb-6 flex flex-col items-center">
          <Image
            alt="flagix logo"
            className="rounded-sm"
            height={40}
            src={FlagixLogo}
            width={40}
          />
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
