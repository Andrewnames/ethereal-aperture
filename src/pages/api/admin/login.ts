import type { APIRoute } from "astro";
import {
  createSession,
  passwordsMatch,
  sessionCookie,
} from "../../../lib/auth";
import { publicUrl } from "../../../lib/http";

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");

  if (!passwordsMatch(password)) {
    return Response.redirect(publicUrl("/admin/login?error=1", request), 303);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/admin",
      "Set-Cookie": sessionCookie(createSession()),
    },
  });
};
