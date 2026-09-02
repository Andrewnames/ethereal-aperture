import type { APIRoute } from "astro";
import { clearSessionCookie } from "../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/admin/login",
      "Set-Cookie": clearSessionCookie(),
    },
  });
};
