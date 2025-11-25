"use client";

import { Button } from "@flagix/ui/components/button";
import { Settings, Trash2, Users } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { DangerZone } from "@/components/settings/danger-zone";
import { GeneralSettings } from "@/components/settings/general-settings";
import { MemberSettings } from "@/components/settings/member-settings";
import PageLoader from "@/components/shared/page-loader";
import { useProjectSettings } from "@/lib/queries/project";
import { useProject } from "@/providers/project";

type SettingTab = "general" | "members" | "danger";

export default function PageClient() {
  const { projectId } = useProject();
  const [activeTab, setActiveTab] = useState<SettingTab>("general");

  const {
    data: settingsData,
    isLoading,
    isError,
  } = useProjectSettings(projectId);

  const tabs: { key: SettingTab; label: string; Icon: React.ElementType }[] =
    useMemo(
      () => [
        { key: "general", label: "General", Icon: Settings },
        { key: "members", label: "Members", Icon: Users },
        { key: "danger", label: "Danger Zone", Icon: Trash2 },
      ],
      []
    );

  const project = settingsData?.project || {
    id: "",
    name: "",
    description: null,
  };
  const members = settingsData?.members || [];
  const userRole = settingsData?.userRole;
  const isAuthorizedToEdit = settingsData?.isAuthorizedToEdit || false;
  const isOwner = userRole === "OWNER";

  const renderContent = useMemo(() => {
    if (!settingsData) {
      return null;
    }

    switch (activeTab) {
      case "general":
        return (
          <GeneralSettings
            isAuthorizedToEdit={isAuthorizedToEdit}
            project={project}
            projectId={projectId}
          />
        );
      case "members":
        return <MemberSettings members={members} />;
      case "danger":
        return (
          <DangerZone
            isOwner={isOwner}
            project={project}
            projectId={projectId}
          />
        );
      default:
        return null;
    }
  }, [
    activeTab,
    project,
    members,
    isAuthorizedToEdit,
    projectId,
    isOwner,
    settingsData,
  ]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !settingsData) {
    return (
      <div className="py-6 text-center text-red-600">
        Failed to load project settings.
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex flex-col space-y-4 overflow-hidden rounded-lg border border-gray-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col space-y-1">
          <h1 className="font-semibold text-gray-900 text-xl">
            Project Settings
          </h1>
          <p className="text-gray-600 text-sm">
            Manage your project's configuration and members.
          </p>
        </div>

        <div className="border-gray-200 border-b">
          <div className="flex space-x-6 overflow-x-auto whitespace-nowrap">
            {tabs.map((tab) => (
              <Button
                className={`relative px-0 py-3 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? "text-emerald-600"
                    : "text-gray-600 hover:text-gray-900"
                } flex items-center`}
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
              >
                <tab.Icon className="mr-2 h-4 w-4" />
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-emerald-600" />
                )}
              </Button>
            ))}
          </div>
        </div>
        <div className="pt-4">{renderContent}</div>
      </div>
    </div>
  );
}
