import type { APIRoute } from "astro";
import { getSite } from "../lib/content";

export const GET: APIRoute = async () => {
  const site = await getSite();
  const body = site.searchable
    ? "User-agent: *\nAllow: /\n"
    : "User-agent: *\nDisallow: /\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
