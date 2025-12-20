import type { APIRoute } from "astro";
import { db } from "../../db";
import { verificationTokens, waitlistUsers } from "../../db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "../../lib/email";
import { render } from "@react-email/render";
import VerificationEmail from "../../emails/verification-email";
import { BASE_URL } from "astro:env/server";
import { randomBytes } from "crypto";

export const prerender = false;

export const POST: APIRoute = async function post({ request }) {
	try {
		const formData = await request.json();

		if (!formData.email || !formData.name) {
			return new Response(
				JSON.stringify({ error: "Email and name are required" }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			return new Response(
				JSON.stringify({ error: "Please provide a valid email address" }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		const existingUser = await db
			.select()
			.from(waitlistUsers)
			.where(eq(waitlistUsers.email, formData.email))
			.limit(1);

		if (existingUser.length > 0) {
			return new Response(
				JSON.stringify({ error: "Email already registered" }),
				{ status: 409, headers: { "Content-Type": "application/json" } },
			);
		}

		const [user] = await db
			.insert(waitlistUsers)
			.values({
				email: formData.email,
				name: formData.name,
				company: formData.company || null,
				serverCount: formData.serverCount || null,
			})
			.returning();

		const token = randomBytes(32).toString("hex");
		const expiresAt = new Date();
		expiresAt.setHours(expiresAt.getHours() + 24);

		await db.insert(verificationTokens).values({
			userId: user.id,
			token,
			expiresAt,
		});

		const verificationUrl = `${BASE_URL}/verify-email?token=${token}`;
		const emailHtml = await render(
			VerificationEmail({
				name: user.name,
				verificationUrl,
			}),
		);

		try {
			await sendEmail({
				to: user.email,
				subject: "Verify your email for ZaneOps Waitlist",
				html: emailHtml,
			});
		} catch (emailError) {
			console.error("Failed to send verification email:", emailError);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: "Please check your email to verify your address",
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	} catch (error) {
		console.error("Signup error:", error);
		return new Response(
			JSON.stringify({ error: "Failed to process signup" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
