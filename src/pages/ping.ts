import type { APIRoute } from "astro";

export const GET: APIRoute = async function get({ props }) {
  return new Response(
    JSON.stringify({
      message: "pong"
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};
