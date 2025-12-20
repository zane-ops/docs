import { Resend } from "resend";
import { RESEND_API_KEY, VERIFICATION_EMAIL_FROM } from "astro:env/server";

const resend = new Resend(RESEND_API_KEY);

export interface SendEmailOptions {
	to: string;
	subject: string;
	html: string;
}

export async function sendEmail(options: SendEmailOptions) {
	const { to, subject, html } = options;

	try {
		const { data, error } = await resend.emails.send({
			from: VERIFICATION_EMAIL_FROM,
			to,
			subject,
			html,
		});

		if (error) {
			console.error("Error sending email:", error);
			throw new Error("Failed to send email");
		}

		return data;
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
}
