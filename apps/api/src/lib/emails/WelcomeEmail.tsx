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

type WelcomeEmailProps = {
  userEmail: string;
};

const appBaseUrl = process.env.APP_URL;

export const WelcomeEmail = ({ userEmail }: WelcomeEmailProps) => {
  const previewText = "Flagix is ready. Start shipping features with control!";

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
              Ready to Ship Smarter
            </Heading>
            <Text className="text-center text-base text-gray-800 leading-relaxed">
              Welcome to **Flagix**! You're now equipped with the ultimate tool
              for modern development: **feature flags**.
              <br />
              <br />
              Use Flagix to safely test in production, roll out features
              gradually, and run precise A/B tests—all without deploying new
              code.
            </Text>

            <Text className="text-center font-semibold text-base text-gray-800 leading-relaxed">
              Your next step is simple: Connect your app!
            </Text>

            <Section className="my-8 text-center">
              <Button
                className="rounded-lg bg-[#10a390] px-7 py-3 font-semibold text-base text-white hover:bg-[#0e8a7d]"
                href={`${appBaseUrl}/onboarding`}
              >
                Go to Setup & Get Your SDK Key
              </Button>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-[#e0e0e0] border-solid" />

            <Text className="text-[12px] text-gray-500 leading-6">
              This account was registered for:{" "}
              <span className="font-medium text-black">{userEmail}</span>.
              <br />
              Need technical help getting set up? Reach out to our engineering
              support team at **support@flagix.com**.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
