import type { APIRoute } from "astro";
import { createInquiry, parseInquiry } from "../../lib/contacts";
import { publicUrl } from "../../lib/http";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function clientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function allow(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

function json(ok: boolean, status = 200) {
  return new Response(JSON.stringify({ ok }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const parsed = parseInquiry(form);
  const wantsJson = request.headers.get("accept")?.includes("application/json");

  if ("spam" in parsed) {
    return wantsJson
      ? json(true)
      : Response.redirect(publicUrl("/#contact", request), 303);
  }

  if ("error" in parsed || !allow(clientKey(request))) {
    return wantsJson
      ? json(false, 400)
      : Response.redirect(publicUrl("/#contact", request), 303);
  }

  await createInquiry(parsed);
  return wantsJson
    ? json(true)
    : Response.redirect(publicUrl("/#contact", request), 303);
};
