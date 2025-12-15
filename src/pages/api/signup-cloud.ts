import type { APIRoute } from "astro";
export const prerender = false;

export const POST: APIRoute = async function post({ request }) {
  try {
    // Parse form data
    const formData = await request.json();

    // Validate required fields
    if (!formData.email || !formData.name) {
      return new Response(
        JSON.stringify({ error: "Email and name are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // TODO: Store in database or send to email service
    // Options: Mailchimp, ConvertKit, Airtable, Google Sheets API
    // For now, we'll just log the data
    console.log("Waitlist signup:", {
      email: formData.email,
      name: formData.name,
      company: formData.company || null,
      serverCount: formData.serverCount || null,
      timestamp: new Date().toISOString()
    });

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Added to waitlist!"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(JSON.stringify({ error: "Failed to process signup" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
