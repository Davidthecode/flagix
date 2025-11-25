import { Button } from "@flagix/ui/components/button";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import type { FullEnvironment } from "@/types/environment";
import { maskApiKey } from "@/utils/environment";

type EnvironmentDetailsProps = {
  environment: FullEnvironment;
  isSubmitting: boolean;
  openDeleteModal: (env: FullEnvironment) => void;
  handleCopy: (key: string) => void;
  copiedKey: boolean;
  setIsKeyVisible: (isVisible: boolean) => void;
  isKeyVisible: boolean;
};

export function EnvironmentDetails({
  environment,
  isSubmitting,
  openDeleteModal,
  handleCopy,
  copiedKey,
  setIsKeyVisible,
  isKeyVisible,
}: EnvironmentDetailsProps) {
  return (
    <div className="pt-4">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h2 className="font-semibold text-gray-900 text-lg capitalize">
              {environment.name}
            </h2>
            {environment.isDefault && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700 text-xs">
                Default
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm">
            Last seen:{" "}
            <span className="font-medium">
              {environment.lastSeenAt
                ? formatDistanceToNow(parseISO(environment.lastSeenAt), {
                    addSuffix: true,
                  })
                : "Never"}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          {!environment.isDefault && (
            <Button
              className="p-1 text-red-600 text-xs hover:bg-red-50 hover:text-red-700"
              disabled={isSubmitting}
              onClick={() => openDeleteModal(environment)}
              variant="ghost"
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <p className="font-medium text-gray-700 text-sm">API Key</p>
          <div className="flex items-center gap-1">
            <Button
              className="rounded p-1 text-gray-500 hover:bg-[#F4F4F5]"
              onClick={() => setIsKeyVisible(!isKeyVisible)}
              size="icon"
              title={isKeyVisible ? "Hide key" : "Show key"}
              variant="ghost"
            >
              {isKeyVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>

            <Button
              className={`rounded p-1 ${
                copiedKey ? "text-emerald-500" : "text-gray-500"
              } hover:bg-[#F4F4F5]`}
              onClick={() => handleCopy(environment.apiKey)}
              size="icon"
              title="Copy key"
              variant="ghost"
            >
              <Copy className={"h-4 w-4"} />
            </Button>
          </div>
        </div>

        <div className="rounded-sm border border-gray-200 bg-[#F4F4F5] p-3">
          <code className="select-all break-all font-mono text-gray-900 text-sm">
            {isKeyVisible ? environment.apiKey : maskApiKey(environment.apiKey)}
          </code>
        </div>

        <p className="mt-3 text-gray-500 text-xs">
          Key created on: {new Date(environment.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
