import { defineMiddleware } from "astro:middleware";
import { readSessionCookie, sessionValid } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  const isAdminPage = path.startsWith("/admin") && path !== "/admin/login";
  const isAdminApi =
    path.startsWith("/api/admin") && path !== "/api/admin/login";

  if (!isAdminPage && !isAdminApi) return next();

  const token = readSessionCookie(context.request.headers.get("cookie"));
  if (sessionValid(token)) return next();

  if (isAdminApi) {
    return new Response("Unauthorized", { status: 401 });
  }

  return context.redirect("/admin/login");
});
