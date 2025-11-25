import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login - Flagix",
  description: "Log in to your Flagix dashboard",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="font-semibold text-2xl text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm">Login to continue</p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Don’t have an account?{" "}
          <Link
            className="font-medium text-green-600 hover:underline"
            href="/signup"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
