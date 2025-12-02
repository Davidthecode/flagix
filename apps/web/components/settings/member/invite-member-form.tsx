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
import { AVAILABLE_ROLES } from "@/lib/constants";
import { useInviteMember } from "@/lib/queries/project";
import { useProject } from "@/providers/project";
import type { ProjectRole } from "@/types/project";

export const InviteNewMemberForm = () => {
  const { projectId } = useProject();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<ProjectRole>("MEMBER");

  const { mutate: inviteMember, isPending: isInviting } =
    useInviteMember(projectId);

  const handleInvite = () => {
    if (newMemberEmail && inviteRole) {
      inviteMember(
        { email: newMemberEmail, role: inviteRole },
        {
          onSuccess: () => {
            setNewMemberEmail("");
          },
          onError: (error) => {
            console.error("Invite failed:", error.message);
          },
        }
      );
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <h2 className="font-semibold text-gray-900 text-lg">Invite New Member</h2>
      <p className="text-gray-600 text-sm">
        Send an invitation link to a user's email, assigning an initial role.
      </p>

      <div className="flex max-w-3xl items-end gap-3 rounded-xl border border-gray-200 bg-[#F4F4F5] p-4 shadow-inner">
        <Input
          className="flex-1 bg-white"
          disabled={isInviting}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          placeholder="name@example.com"
          type="email"
          value={newMemberEmail}
        />
        <Select
          disabled={isInviting}
          onValueChange={(value: ProjectRole) => setInviteRole(value)}
          value={inviteRole}
        >
          <SelectTrigger className="w-[120px] bg-white text-sm capitalize">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {AVAILABLE_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.toLowerCase()}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className="h-[42px] min-w-[100px] bg-emerald-600 text-white hover:bg-emerald-700"
          disabled={!newMemberEmail || isInviting}
          onClick={handleInvite}
        >
          {isInviting ? "Sending..." : "Invite"}
        </Button>
      </div>
    </div>
  );
};
