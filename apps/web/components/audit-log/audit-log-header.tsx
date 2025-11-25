import { Button } from "@flagix/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@flagix/ui/components/dropdown-menu";
import { Check, ChevronDown, Clock, Filter } from "lucide-react";
import type React from "react";

interface AuditLogHeaderProps {
  selectedEnvironment: string;
  filterOptions: Array<{ name: string; isAll: boolean }>;
  auditLogsLength: number;
  totalCount: number;
  isLoadingEnvs: boolean;
  isFetchingLogs: boolean;
  onEnvironmentChange: (envName: string) => void;
}

export const AuditLogHeader: React.FC<AuditLogHeaderProps> = ({
  selectedEnvironment,
  filterOptions,
  auditLogsLength,
  totalCount,
  isLoadingEnvs,
  isFetchingLogs,
  onEnvironmentChange,
}) => (
  <>
    <div className="flex flex-col space-y-1">
      <h1 className="font-semibold text-gray-900 text-xl">Audit Log</h1>
      <p className="text-gray-600 text-sm">
        A comprehensive, time-ordered list of all changes and activity within
        this project.
      </p>
    </div>

    <div className="flex items-center justify-between border-gray-200 border-b pb-4">
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <Clock className="h-4 w-4 text-gray-400" />
        Showing {auditLogsLength} of {totalCount} Activities
        {isFetchingLogs && (
          <span className="ml-2 animate-pulse text-gray-400">
            (Updating...)
          </span>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex items-center gap-2 border border-gray-300 bg-white p-2 text-gray-700 text-sm hover:bg-[#F4F4F5]"
            disabled={isFetchingLogs || isLoadingEnvs}
          >
            <Filter className="h-4 w-4" />
            <span className="capitalize">{selectedEnvironment}</span>
            <ChevronDown className="ml-1 h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          {filterOptions.map((option) => (
            <DropdownMenuItem
              className={`cursor-pointer capitalize ${
                selectedEnvironment === option.name
                  ? "font-medium text-emerald-600"
                  : "text-gray-700"
              }`}
              key={option.name}
              onClick={() => onEnvironmentChange(option.name)}
            >
              <div className="flex w-full items-center justify-between">
                {option.isAll ? option.name : option.name}
                {selectedEnvironment === option.name && (
                  <Check className="ml-2 h-4 w-4 text-emerald-600" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </>
);
