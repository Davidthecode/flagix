import "dotenv/config";

export const env = {
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  API_URL: process.env.API_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};
