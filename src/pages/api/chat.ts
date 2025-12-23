import Anthropic from "@anthropic-ai/sdk";
import type { APIRoute } from "astro";
import fs from "fs/promises";
import path from "path";

const anthropic = new Anthropic({
  apiKey: import.meta.env.ANTHROPIC_API_KEY
});

async function getAllDocsRecursive(dir: string, baseDir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const docContents: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subDocs = await getAllDocsRecursive(fullPath, baseDir);
      docContents.push(...subDocs);
    } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
      const relativePath = path.relative(baseDir, fullPath);
      const content = await fs.readFile(fullPath, "utf-8");
      docContents.push(`## File: ${relativePath}\n\n${content}\n\n---\n`);
    }
  }

  return docContents;
}

async function getAllDocs(): Promise<string> {
  const docsDir = path.join(process.cwd(), "src/content/docs");
  const docContents = await getAllDocsRecursive(docsDir, docsDir);
  return docContents.join("\n");
}

export const POST: APIRoute = async function post({ request }) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
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
          text: "You are a helpful assistant for ZaneOps documentation. Answer questions based on the documentation provided. Be concise and direct. If you don't know something, say so.",
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
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
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
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
