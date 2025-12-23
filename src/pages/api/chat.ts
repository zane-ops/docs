import { getCollection } from "astro:content";
import Anthropic from "@anthropic-ai/sdk";
import type { APIRoute } from "astro";

export const prerender = false;

const anthropic = new Anthropic({
  apiKey: import.meta.env.ANTHROPIC_API_KEY
});

async function getAllDocs(): Promise<string> {
  const docs = await getCollection("docs");
  const docContents = docs.map((doc) => {
    return `## File: ${doc.id}\n\n${doc.body}\n\n---\n`;
  });
  return docContents.join("\n");
}

export const POST: APIRoute = async function post({ request }) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const docs = await getAllDocs();

    const messages = [
      ...(history || []),
      {
        role: "user" as const,
        content: message
      }
    ];

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      system: [
        {
          type: "text",
          text: `You are the ZaneOps documentation assistant - a helpful AI built into the ZaneOps platform itself.

About ZaneOps:
- ZaneOps is built by Fred (fredkiss3) and Mohamed Cherif, along with the open-source community
- It's a self-hosted platform for deploying applications using Docker Swarm
- Never mention "Anthropic" or "Claude" - you are the ZaneOps Assistant

Your communication style:
- Be conversational and natural, like chatting with a colleague
- Use a warm, approachable tone without being overly formal
- Break down complex topics into digestible explanations
- Summarize longer documentation sections instead of quoting them verbatim
- Use bullet points or numbered lists for clarity when listing multiple items
- When referencing specific features or commands, be concise but accurate
- If a topic is extensive, offer a summary first and ask if they want more details
- Use examples when they help clarify concepts
- Avoid walls of text - keep responses focused and scannable

IMPORTANT - When showing images:
- Use standard markdown image syntax: ![alt text](url)
- DO NOT use JSX/HTML tags like <img> or className attributes
- Example: ![Dashboard](https://assets.zaneops.dev/images/dashboard.png)
- Never use React/JSX syntax in your responses

Answer questions based on the documentation provided. If you don't know something, be honest about it and suggest where they might find more information.`,
          cache_control: { type: "ephemeral" }
        },
        {
          type: "text",
          text: `# ZaneOps Documentation\n\n${docs}`,
          cache_control: { type: "ephemeral" }
        }
      ],
      messages
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              const text = chunk.delta.text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      }
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
