import type { APIRoute } from "astro";
import {
  createSession,
  passwordsMatch,
  sessionCookie,
} from "../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");

  if (!passwordsMatch(password)) {
    return Response.redirect(new URL("/admin/login?error=1", request.url), 303);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/admin",
      "Set-Cookie": sessionCookie(createSession()),
    },
  });
};
