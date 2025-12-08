import { Resend } from "resend";
import { env } from "@/config/env";
import { ProjectInviteEmail } from "@/lib/emails/ProjectInviteEmail";

const resend = new Resend(env.RESEND_API_KEY);

type sendProjectInviteEmailPropsType = {
  to: string;
  projectName: string;
  role: string;
  inviteLink: string;
};

export async function sendProjectInviteEmail({
  to,
  projectName,
  role,
  inviteLink,
}: sendProjectInviteEmailPropsType) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "ajiboladavid0963@gmail.com", //email
    subject: `Invitation to join project ${projectName}`,
    react: ProjectInviteEmail({
      projectName,
      projectInviteLink: inviteLink,
      invitedRole: role,
      invitedEmail: to,
    }),
  });
}
