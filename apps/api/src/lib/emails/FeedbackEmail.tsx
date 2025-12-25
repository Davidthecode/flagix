import {
  Body,
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

type FeedbackEmailProps = {
  userEmail: string;
  userName: string | null;
  feedback: string;
};

const appBaseUrl = env.FRONTEND_URL;

export const FeedbackEmail = ({
  userEmail,
  userName,
  feedback,
}: FeedbackEmailProps) => {
  const previewText = `New feedback from ${userName || userEmail}`;

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
              User Feedback
            </Heading>

            <Text className="text-base text-gray-800 leading-relaxed">
              <b>From:</b> {userName ? `${userName} (${userEmail})` : userEmail}
            </Text>

            <Section className="my-6 rounded-lg bg-gray-50 p-4">
              <Text className="text-base text-gray-800 leading-relaxed">
                {feedback}
              </Text>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-[#e0e0e0] border-solid" />

            <Text className="text-[12px] text-gray-500 leading-6">
              This feedback was submitted through the Flagix application.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

