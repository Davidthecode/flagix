"use client";

import { Skeleton } from "@flagix/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableRow,
} from "@flagix/ui/components/table";
import { Search } from "lucide-react";
import { FlagTableHeader } from "@/components/flags/flag-table-header";
import { FlagTableRow } from "@/components/flags/flag-table-row";
import type { FlagType } from "@/types/flag";

const SkeletonRow = () => (
  <TableRow className="px-0! py-0!" hoverable={false}>
    <div className="grid grid-cols-[3fr_1fr] items-center gap-4 px-6 py-4">
      <TableCell>
        <Skeleton className="mb-1 h-4 w-3/5" />
        <Skeleton className="h-3 w-4/5" />
      </TableCell>

      <TableCell className="text-gray-500">
        <Skeleton className="h-4 w-4/5" />
      </TableCell>
    </div>
  </TableRow>
);

type FlagTableListProps = {
  isLoading: boolean;
  projectId: string;
  filteredFlags: FlagType[];
  searchTerm: string;
};

export const FlagTableList = ({
  filteredFlags,
  isLoading,
  projectId,
  searchTerm,
}: FlagTableListProps) => {
  const renderTableBody = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Fixed length, stateless skeleton list
        <SkeletonRow key={idx} />
      ));
    }

    if (filteredFlags.length > 0) {
      return filteredFlags.map((flag) => (
        <FlagTableRow flag={flag} key={flag.key} projectId={projectId} />
      ));
    }

    const isSearchEmpty = searchTerm.length > 0;

    return (
      <TableEmpty>
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F4F5]">
          <Search className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-600 text-sm">
          {isSearchEmpty
            ? "No flags found matching your search."
            : "There are no feature flags in this project."}
        </p>
      </TableEmpty>
    );
  };

  return (
    <Table>
      <FlagTableHeader />
      <TableBody>{renderTableBody()}</TableBody>
    </Table>
  );
};
