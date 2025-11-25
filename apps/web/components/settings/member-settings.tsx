"use client";

import { Button } from "@flagix/ui/components/button";
import { Input } from "@flagix/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@flagix/ui/components/select";
import { useState } from "react";
import type { ProjectMemberDetail, ProjectRole } from "@/types/project";

type MemberSettingsProps = {
  members: ProjectMemberDetail[];
  // isAuthorizedToEdit: boolean; // Not strictly needed as the backend is not implemented
};

export const MemberSettings = ({ members }: MemberSettingsProps) => {
  const roles: ProjectRole[] = ["OWNER", "ADMIN", "MEMBER", "VIEWER"];

  const [newMemberEmail, setNewMemberEmail] = useState("");

  return (
    <div className="relative space-y-6">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-white/50 p-8 text-center">
        <p className="mt-1 font-semibold text-gray-700">Coming Soon</p>
        <p className="mt-1 max-w-sm text-gray-600 text-sm">
          You'll soon be able to invite, remove, and manage member roles
          directly from this interface.
        </p>
      </div>

      <div className="flex flex-col space-y-1">
        <h2 className="font-semibold text-gray-900 text-lg">
          Project Members ({members.length})
        </h2>
        <p className="text-gray-600 text-sm">
          Invite new users and manage existing member roles.
        </p>
      </div>

      <div className="flex max-w-2xl items-end gap-3 rounded-xl border bg-[#F4F4F5] p-4">
        <Input
          className="bg-white"
          onChange={(e) => setNewMemberEmail(e.target.value)}
          placeholder="name@example.com"
          value={newMemberEmail}
        />
        <Button className="h-[42px] min-w-[100px] bg-emerald-600 text-white hover:bg-emerald-700">
          Invite
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F4F4F5]">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                User
              </th>
              <th className="w-1/4 px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-medium text-gray-900 text-sm">
                    {member.user.name}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {member.user.email}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Select value={member.role}>
                    <SelectTrigger className="w-[120px] text-sm capitalize">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-sm">
                  {member.role !== "OWNER" ? (
                    <Button
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      variant="ghost"
                    >
                      Remove
                    </Button>
                  ) : (
                    <span className="text-gray-400">Owner</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
