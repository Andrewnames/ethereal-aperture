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

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const parsed = parseInquiry(form);

  if ("spam" in parsed) {
    return Response.redirect(publicUrl("/?sent=1#contact", request), 303);
  }

  if ("error" in parsed || !allow(clientKey(request))) {
    return Response.redirect(publicUrl("/?error=1#contact", request), 303);
  }

  await createInquiry(parsed);
  return Response.redirect(publicUrl("/?sent=1#contact", request), 303);
};
