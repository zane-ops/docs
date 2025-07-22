import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

const docs = await getCollection("docs");

export const GET: APIRoute = async ({ params, request }) => {
  return new Response(
    `# zaneops.dev Full Documentation\n\n${docs
      .map((doc) => {
        return `# ${doc.data.title}\n\n${doc.body}\n\n`;
      })
      .join("")}`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow"
      }
    }
  );
};
