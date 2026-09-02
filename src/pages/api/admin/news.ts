import type { APIRoute } from "astro";
import { deleteNews, upsertNews } from "../../../lib/content";

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const action = String(form.get("action") ?? "save");
  const id = String(form.get("id") ?? "");

  if (action === "delete") {
    if (id) await deleteNews(id);
  } else {
    await upsertNews({
      id,
      year: String(form.get("year") ?? ""),
      headline: String(form.get("headline") ?? ""),
      description: String(form.get("description") ?? ""),
      flag: String(form.get("flag") ?? "") || undefined,
      linkLabel: String(form.get("linkLabel") ?? "") || undefined,
      linkHref: String(form.get("linkHref") ?? "") || undefined,
    });
  }

  return Response.redirect(new URL("/admin/news?saved=1", request.url), 303);
};
