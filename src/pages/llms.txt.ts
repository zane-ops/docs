import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

const docs = await getCollection("docs");

export const GET: APIRoute = async ({ params, request }) => {
  return new Response(
    `# zaneops.dev Documentation\n\n${docs
      .map((doc) => {
        return `- [${doc.data.title}](https://zaneops.dev/${doc.id}/)\n`;
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
