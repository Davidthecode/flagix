"use client";

import { Table, TableBody, TableHeader } from "@flagix/ui/components/table";
import { MemberTableRow } from "@/components/settings/member/member-table-row";
import type { ProjectMemberDetail } from "@/types/project";

type MembersTableProps = {
  members: ProjectMemberDetail[];
};

export const MembersTable = ({ members }: MembersTableProps) => (
  <div className="space-y-4">
    <h2 className="font-semibold text-gray-900 text-lg">
      Members ({members.length})
    </h2>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <div className="grid grid-cols-12">
            <div className="col-span-4 text-left font-medium text-gray-500 text-xs uppercase">
              User
            </div>
            <div className="col-span-2 text-left font-medium text-gray-500 text-xs uppercase">
              Status
            </div>
            <div className="col-span-3 text-left font-medium text-gray-500 text-xs uppercase">
              Role
            </div>
            <div className="col-span-3 text-right font-medium text-gray-500 text-xs uppercase">
              Actions
            </div>
          </div>
        </TableHeader>

        <TableBody>
          <TableBody>
            {members.map((member) => (
              <MemberTableRow key={member.id} member={member} />
            ))}
          </TableBody>
        </TableBody>
      </Table>
    </div>
    <p className="mt-2 text-gray-500 text-xs">
      *Note: Only an **Owner** can remove other Owners or Admins.
    </p>
  </div>
);
