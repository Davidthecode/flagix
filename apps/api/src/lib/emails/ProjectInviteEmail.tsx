import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { env } from "@/config/env";

type ProjectInviteEmailProps = {
  projectName: string;
  projectInviteLink: string;
  invitedRole: string;
  invitedEmail: string;
};

const appBaseUrl = env.FRONTEND_URL;

export const ProjectInviteEmail = ({
  projectName,
  projectInviteLink,
  invitedRole,
  invitedEmail,
}: ProjectInviteEmailProps) => {
  const previewText = `You've been invited to join the project: ${projectName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-10 max-w-[465px] rounded border border-[#e0e0e0] border-solid p-5">
            <Section className="mt-8">
              <Img
                alt="Flagix Logo"
                className="mx-auto"
                height="48"
                src={`${appBaseUrl}/icon.png`}
                width="48"
              />
            </Section>

            <Heading className="my-6 text-center font-bold text-3xl text-[#10a390]">
              Project Invitation
            </Heading>
            <Text className="text-center text-base text-gray-800 leading-relaxed">
              You have been invited to join the project{" "}
              <b className="font-bold text-[#10a390]">{projectName}</b>.
            </Text>

            <Text className="text-center font-semibold text-base text-gray-800 leading-relaxed">
              Your assigned role will be {invitedRole}.
            </Text>

            <Section className="my-8 text-center">
              <Button
                className="rounded-lg bg-[#10a390] px-7 py-3 font-semibold text-base text-white"
                href={projectInviteLink}
              >
                Accept Invitation
              </Button>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-[#e0e0e0] border-solid" />

            <Text className="text-[12px] text-gray-500 leading-6">
              This invitation was sent to:{" "}
              <span className="font-medium text-black">{invitedEmail}</span>.
              <br />
              If you did not expect this invitation, you can safely ignore this
              email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
