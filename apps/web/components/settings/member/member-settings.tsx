"use client";

import { InviteNewMemberForm } from "@/components/settings/member/invite-member-form";
import { MembersTable } from "@/components/settings/member/members-table";
import { RoleDefinitionsSection } from "@/components/settings/member/role-definition-section";
import type { ProjectMemberDetail } from "@/types/project";

type MemberSettingsProps = {
  members: ProjectMemberDetail[];
};

export const MemberSettings = ({ members }: MemberSettingsProps) => (
  <div className="relative space-y-8">
    <InviteNewMemberForm />
    <div className="my-8 h-px w-full bg-gray-200" />
    <MembersTable members={members} />
    <div className="my-8 h-px w-full bg-gray-200" />
    <RoleDefinitionsSection />
  </div>
);
