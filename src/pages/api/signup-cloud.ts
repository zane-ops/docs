import type { APIRoute } from "astro";
export const prerender = false;

export const POST: APIRoute = async function get({ props }) {
  return new Response();
};
