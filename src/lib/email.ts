import { VERIFICATION_EMAIL_FROM } from "astro:env/server";
import nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(options: SendEmailOptions) {
  const { to, subject, html, text } = options;

  const params = {
    host: import.meta.env.SMTP_HOST || "localhost",
    port: Number(import.meta.env.SMTP_PORT) || 1025,
    secure: import.meta.env.SMTP_SECURE === "true",
    auth: import.meta.env.SMTP_USER
      ? {
          user: import.meta.env.SMTP_USER,
          pass: import.meta.env.SMTP_PASSWORD
        }
      : undefined
  };

  const transporter = nodemailer.createTransport(params);

  console.log("Sending email:", params);

  try {
    const info = await transporter.sendMail({
      from: VERIFICATION_EMAIL_FROM,
      to,
      subject,
      html,
      text
    });

    console.log("Email sent:", {
      messageId: info.messageId,
      to,
      subject
    });

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  } finally {
    console.log("\n--- Email ---");
    console.log(text);
    console.log("--- End Email ---\n");
  }
}
