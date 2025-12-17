"use client";

import { toast } from "@flagix/ui/components/sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CreateFlagModal } from "@/components/flags/create-flag-modal";
import { FlagControlsHeader } from "@/components/flags/flag-controls-header";
import { FlagTableList } from "@/components/flags/flag-table-list";
import { api } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queries/keys";
import { useProject } from "@/providers/project";
import type { FlagType } from "@/types/flag";

type CreateFlagPayload = {
  key: string;
  description: string;
  projectId: string;
};

function FlagsPageClient() {
  const { projectId } = useProject();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: flags,
    isLoading,
    isError,
  } = useQuery<FlagType[]>({
    queryKey: projectId ? QUERY_KEYS.FLAGS(projectId) : undefined,
    queryFn: () =>
      api.get(`/api/flags?projectId=${projectId}`).then((res) => res.data),
    enabled: Boolean(projectId),
  });

  const createFlagMutation = useMutation({
    mutationFn: (payload: CreateFlagPayload) =>
      api.post<FlagType>("/api/flags", payload).then((res) => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FLAGS(projectId) });
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Failed to create flag:", error);
      toast.error("Failed to create flag");
    },
  });

  const flagList = flags || [];

  const filteredFlags = useMemo(
    () =>
      flagList.filter(
        (flag) =>
          flag.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          flag.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ""
      ),
    [flagList, searchTerm]
  );

  const handleCreateFlag = (key: string, description: string) => {
    if (flags.some((flag) => flag.key === key)) {
      toast.error(`Flag with key '${key}' already exists.`);
      return;
    }

    createFlagMutation.mutate({ key, description, projectId });
  };

  const flagCountDisplay = isLoading
    ? "Loading..."
    : `${flagList.length} ${flagList.length === 1 ? "Flag" : "Flags"} Total`;

  const isControlsDisabled = createFlagMutation.isPending;

  if (isError) {
    return <div className="py-8 text-red-500">Failed to load flags.</div>;
  }

  return (
    <div>
      <div className="py-8">
        <FlagControlsHeader
          flagCountDisplay={flagCountDisplay}
          isControlsDisabled={isControlsDisabled}
          onOpenCreateModal={() => setIsModalOpen(true)}
          onSearchTermChange={setSearchTerm}
          searchTerm={searchTerm}
        />

        <FlagTableList
          filteredFlags={filteredFlags}
          isLoading={isLoading}
          projectId={projectId}
          searchTerm={searchTerm}
        />
      </div>

      <CreateFlagModal
        isOpen={isModalOpen}
        isSubmitting={isControlsDisabled}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateFlag}
      />
    </div>
  );
}

export default FlagsPageClient;
