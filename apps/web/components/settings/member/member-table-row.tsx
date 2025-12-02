import { Button } from "@flagix/ui/components/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@flagix/ui/components/select";
import { TableCell, TableRow } from "@flagix/ui/components/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@flagix/ui/components/tooltip";
import { Info, Mail, UserX } from "lucide-react";
import { AVAILABLE_ROLES, ROLES_INFO } from "@/lib/constants";
import {
  useCancelInvite,
  useRemoveMember,
  useResendInvite,
  useUpdateMemberRole,
} from "@/lib/queries/project";
import { useProject } from "@/providers/project";
import type { ProjectMemberDetail, ProjectRole } from "@/types/project";

type MemberTableRowProps = {
  member: ProjectMemberDetail;
};

export const MemberTableRow = ({ member }: MemberTableRowProps) => {
  const { projectId } = useProject();

  const { mutate: updateRole } = useUpdateMemberRole(projectId);

  const { mutate: removeMember, isPending: isRemoving } =
    useRemoveMember(projectId);

  const { mutate: cancelInvite, isPending: isCanceling } =
    useCancelInvite(projectId);
  const { mutate: resendInvite, isPending: isResending } =
    useResendInvite(projectId);

  const isPending = member.status === "PENDING";
  const isOwner = member.role === "OWNER";
  const isBusy = isRemoving || isCanceling || isResending;

  const roleInfo = ROLES_INFO.find((r) => r.role === member.role);
  const roleTagClass = roleInfo?.tagColor ?? "bg-gray-100 text-gray-500";

  const handleRoleChange = (newRole: ProjectRole) => {
    if (!isOwner && !isPending) {
      updateRole({ memberId: member.id, newRole });
    }
  };

  const handleRemoveActiveMember = () => {
    removeMember(member.id);
  };

  const handleCancelInvite = () => {
    cancelInvite(member.id);
  };

  const handleResendInvite = () => {
    resendInvite(member.id);
  };

  const renderActions = () => {
    if (isOwner) {
      return <span className="text-gray-400">Project Owner</span>;
    }

    if (isPending) {
      return (
        <div className="flex justify-end gap-1">
          <Button
            className="bg-emerald-600 px-2 py-2 text-white text-xs hover:bg-emerald-700"
            disabled={isBusy}
            onClick={handleResendInvite}
            type="button"
          >
            {isResending ? "Sending..." : "Resend"}
          </Button>
          <Button
            className="border-gray-300 bg-red-600 px-2 py-2 text-white text-xs hover:bg-red-700"
            disabled={isBusy}
            onClick={handleCancelInvite}
            type="button"
          >
            {isCanceling ? "Canceling..." : "Cancel"}
          </Button>
        </div>
      );
    }

    return (
      <Button
        className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700"
        disabled={isRemoving}
        onClick={handleRemoveActiveMember}
      >
        <UserX className="mr-1 h-4 w-4" /> Remove
      </Button>
    );
  };

  return (
    <TableRow className={"grid grid-cols-12"} hoverable key={member.id}>
      <TableCell className="col-span-4">
        <div className="font-medium text-gray-900">
          {member.user.name || "N/A"}
        </div>
        <div className="text-gray-500 text-xs">{member.user.email}</div>
      </TableCell>

      <TableCell className="col-span-2">
        {isPending ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 font-medium text-xs text-yellow-800">
            <Mail className="h-3 w-3" /> Pending
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800 text-xs">
            Active
          </span>
        )}
      </TableCell>

      <TableCell className="col-span-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                {isOwner ? (
                  <span
                    className={`rounded-sm px-2 py-1 font-bold text-sm capitalize ${roleTagClass}`}
                  >
                    owner
                  </span>
                ) : (
                  <Select
                    disabled={isPending}
                    onValueChange={handleRoleChange}
                    value={member.role}
                  >
                    <SelectTrigger className="w-32 text-sm capitalize">
                      <SelectValue />
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
                )}
                <Info className="h-3 w-3 text-gray-400 hover:text-gray-600" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              {roleInfo?.description}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>

      <TableCell className="col-span-3 text-right">{renderActions()}</TableCell>
    </TableRow>
  );
};
