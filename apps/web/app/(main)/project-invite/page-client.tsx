"use client";

import { Button } from "@flagix/ui/components/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAcceptInvite } from "@/lib/queries/project";

type ProjectMemberDetailWithProject = {
  id: string;
  role: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  project: {
    id: string;
    name: string;
  };
};

export default function PageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    mutate: acceptInvite,
    isPending,
    isSuccess,
    isError,
    data,
    error,
  } = useAcceptInvite();

  useEffect(() => {
    if (token && !isSuccess && !isError) {
      acceptInvite({ token });
    }
  }, [token, isSuccess, isError, acceptInvite]);

  useEffect(() => {
    if (isSuccess && data) {
      const projectId = (data as ProjectMemberDetailWithProject).project.id;
      router.replace(`/projects/${projectId}/dashboard`);
    }
  }, [isSuccess, data, router]);

  const renderMissingTokenState = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <XCircle className="h-10 w-10 text-red-500" />
      <h1 className="mt-4 font-bold text-2xl text-gray-800">
        Invalid Invitation Link
      </h1>
      <p className="max-w-md text-gray-600">
        The invitation link is missing the required token. Please ensure you
        clicked the full link provided in the email.
      </p>
      <Button
        className="mt-6 bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
        onClick={() => router.push("/")}
      >
        Go to Homepage
      </Button>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      <p className="mt-4 font-medium text-gray-700 text-lg">
        Accepting invitation...
      </p>
      <p className="text-gray-500 text-sm">
        Validating token and updating your project access.
      </p>
    </div>
  );

  const renderErrorState = () => {
    const errorMessage =
      (error?.response?.data as { error?: string })?.error ||
      "An unexpected error occurred. Please try again or contact support.";

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <XCircle className="h-10 w-10 text-red-500" />
        <h1 className="mt-4 font-bold text-2xl text-gray-800">
          Invitation Failed
        </h1>
        <p className="max-w-md text-gray-600">{errorMessage}</p>
        <Button
          className="mt-6 bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
          onClick={() => router.push("/dashboard")}
        >
          Go to home
        </Button>
      </div>
    );
  };

  const renderSuccessState = () => {
    const project = (data as ProjectMemberDetailWithProject).project;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <CheckCircle className="h-10 w-10 text-emerald-500" />
        <h1 className="mt-4 font-bold text-2xl text-gray-800">
          Success! You have joined {project.name}.
        </h1>
        <p className="text-gray-600">You will be redirected shortly.</p>
        <Button
          className="mt-6 bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
          onClick={() => router.replace(`/projects/${project.id}/dashboard`)}
        >
          Go to Project Dashboard
        </Button>
      </div>
    );
  };

  if (!token) {
    return renderMissingTokenState();
  }

  if (isError) {
    return renderErrorState();
  }

  if (isSuccess && data) {
    return renderSuccessState();
  }

  if (isPending) {
    return renderLoadingState();
  }

  return renderLoadingState();
}
