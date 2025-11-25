"use client";

import { Button } from "@flagix/ui/components/button";
import { Input } from "@flagix/ui/components/input";
import { Table, TableBody, TableEmpty } from "@flagix/ui/components/table";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { FlagTableHeader } from "@/components/flags/flag-table-header";
import { FlagTableRow } from "@/components/flags/flag-table-row";
import type { FlagType } from "@/types/flag";

type FlagTableOverviewProps = {
  flags: FlagType[];
  onOpenCreateModal: () => void;
  projectId: string;
};

export const FlagTableOverview = ({
  flags,
  onOpenCreateModal,
  projectId,
}: FlagTableOverviewProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFlags = useMemo(
    () =>
      flags.filter(
        (flag) =>
          flag.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          flag.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [flags, searchTerm]
  );

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-semibold text-xl">Flags Management</h2>
        <Button
          className="flex bg-emerald-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-emerald-70"
          onClick={onOpenCreateModal}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Flag
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative w-80">
          <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
          <Input
            className="h-10 w-full rounded-lg border-gray-200 bg-white pr-4 pl-10 text-sm transition-shadow placeholder:text-gray-400"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search flags..."
            type="search"
            value={searchTerm}
          />
        </div>
        <span className="text-gray-500 text-sm">
          {flags.length} {flags.length === 1 ? "Flag" : "Flags"} Total
        </span>
      </div>

      <Table>
        <FlagTableHeader />
        <TableBody>
          {filteredFlags.length > 0 ? (
            filteredFlags.map((flag) => (
              <FlagTableRow flag={flag} key={flag.key} projectId={projectId} />
            ))
          ) : (
            <TableEmpty>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm">
                No flags found matching your search.
              </p>
            </TableEmpty>
          )}
        </TableBody>
      </Table>
    </>
  );
};
