"use client";

import { toast } from "@flagix/ui/components/sonner";
import { useEffect, useRef, useState } from "react";
import { CreateEnvironmentModal } from "@/components/environment/create-environment-modal";
import { DeleteEnvironmentModal } from "@/components/environment/delete-environment-modal";
import { EnvironmentDetails } from "@/components/environment/environment-details";
import { EnvironmentTabs } from "@/components/environment/environment-tabs";
import PageLoader from "@/components/shared/page-loader";
import {
  useCreateEnvironment,
  useDeleteEnvironment,
  useEnvironments,
} from "@/lib/queries/environments";
import { useProject } from "@/providers/project";
import type { FullEnvironment } from "@/types/environment";

export default function PageClient() {
  const { projectId } = useProject();

  const {
    data: environments = [],
    isLoading,
    isError,
    isFetching,
  } = useEnvironments(projectId);
  const createMutation = useCreateEnvironment(projectId);
  const deleteMutation = useDeleteEnvironment(projectId);

  const isSubmitting = createMutation.isPending || deleteMutation.isPending;

  const [selectedEnvId, setSelectedEnvId] = useState<string | null>(null);
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [environmentToDelete, setEnvironmentToDelete] =
    useState<FullEnvironment | null>(null);

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const selectedEnv = environments.find((env) => env.id === selectedEnvId);

  useEffect(() => {
    if (environments.length > 0 && !selectedEnvId) {
      setSelectedEnvId(environments[0].id);
    } else if (
      selectedEnvId &&
      !environments.some((env) => env.id === selectedEnvId) &&
      environments.length > 0
    ) {
      setSelectedEnvId(environments[0].id);
    } else if (environments.length === 0) {
      setSelectedEnvId(null);
    }
  }, [environments, selectedEnvId]);

  useEffect(() => {
    if (tabsContainerRef.current && selectedEnvId) {
      const selectedTab = tabsContainerRef.current.querySelector(
        `[data-env-id="${selectedEnvId}"]`
      );
      selectedTab?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedEnvId]);

  const handleCopy = (key: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = key;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCreateEnvironment = (name: string) => {
    createMutation.mutate(
      { name },
      {
        onSuccess: (newEnv: FullEnvironment) => {
          setSelectedEnvId(newEnv.id);
          setIsCreateModalOpen(false);
        },
      }
    );
  };

  const handleDeleteEnvironment = () => {
    if (!environmentToDelete) {
      return;
    }

    deleteMutation.mutate(environmentToDelete.id, {
      onSuccess: () => {
        setEnvironmentToDelete(null);
        setIsDeleteModalOpen(false);
        setIsKeyVisible(false);
        toast.success(
          `Environment '${environmentToDelete.name}' deleted successfully.`
        );
      },
    });
  };

  const openDeleteModal = (env: FullEnvironment) => {
    setEnvironmentToDelete(env);
    setIsDeleteModalOpen(true);
  };

  const envToDelete = environmentToDelete;

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600">
        <h2 className="font-semibold text-xl">Failed to Load Environments</h2>
        <p className="text-red-500">
          We couldn't retrieve the environments for this project. Please ensure
          you have permission.
        </p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex flex-col space-y-4 overflow-hidden rounded-lg border border-gray-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col space-y-1">
          <h1 className="font-semibold text-gray-900 text-xl">Environments</h1>
          <p className="text-gray-600 text-sm">
            Manage your environments and API keys
          </p>
        </div>

        <EnvironmentTabs
          environments={environments}
          isFetching={isFetching}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          selectedEnvId={selectedEnvId}
          setIsCreateModalOpen={setIsCreateModalOpen}
          setSelectedEnvId={setSelectedEnvId}
          tabsContainerRef={tabsContainerRef}
        />

        {selectedEnv ? (
          <EnvironmentDetails
            copiedKey={copiedKey}
            environment={selectedEnv}
            handleCopy={handleCopy}
            isKeyVisible={isKeyVisible}
            isSubmitting={isSubmitting}
            openDeleteModal={openDeleteModal}
            setIsKeyVisible={setIsKeyVisible}
          />
        ) : (
          <div className="py-10 text-center text-gray-500">
            No environments configured for this project.
          </div>
        )}
      </div>

      <CreateEnvironmentModal
        isOpen={isCreateModalOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEnvironment}
      />

      <DeleteEnvironmentModal
        environmentName={envToDelete?.name ?? ""}
        isOpen={isDeleteModalOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleDeleteEnvironment}
      />
    </div>
  );
}
