import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up - Flagix",
  description: "Create a Flagix account",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="font-semibold text-2xl text-gray-900">
            Create your account
          </h1>
          <p className="text-gray-500 text-sm">Get started with Flagix</p>
        </div>

        <Suspense>
          <SignupForm />
        </Suspense>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link
            className="font-medium text-green-600 hover:underline"
            href="/login"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
