import { Resend } from "resend";
import { WelcomeEmail } from "@/lib/emails/WelcomeEmail";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendWelcomeEmail({ userEmail }: { userEmail: string }) {
  if (!resend) {
    throw new Error("Resend API key not set");
  }

  try {
    await resend.emails.send({
      from: "flagix <emails@flagix.com>",
      to: userEmail,
      subject: "Welcome to flagix!",
      react: WelcomeEmail({
        userEmail,
      }),
    });

    return { message: "Email sent successfully" };
  } catch (error) {
    console.error("error sending email:", error);
    return { error: "Failed to send email", details: error };
  }
}
