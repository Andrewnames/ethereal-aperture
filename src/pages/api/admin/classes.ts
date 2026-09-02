import type { APIRoute } from "astro";
import { deleteClass, upsertPast, upsertUpcoming } from "../../../lib/content";
import type { ClassStatus } from "../../../lib/types";

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const action = String(form.get("action") ?? "save");
  const id = String(form.get("id") ?? "");
  const kind = String(form.get("kind") ?? "upcoming");

  if (action === "delete") {
    if (id) await deleteClass(id);
  } else if (kind === "past") {
    await upsertPast({
      id,
      term: String(form.get("term") ?? ""),
      title: String(form.get("title") ?? ""),
      note: String(form.get("note") ?? ""),
      photosHref: String(form.get("photosHref") ?? "#student-work"),
    });
  } else {
    await upsertUpcoming({
      id,
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      status: String(form.get("status") ?? "coming-soon") as ClassStatus,
      ctaLabel: String(form.get("ctaLabel") ?? ""),
      ctaHref: String(form.get("ctaHref") ?? ""),
      dates: String(form.get("dates") ?? "") || undefined,
      time: String(form.get("time") ?? "") || undefined,
      where: String(form.get("where") ?? "") || undefined,
      level: String(form.get("level") ?? "") || undefined,
      bring: String(form.get("bring") ?? "") || undefined,
      cost: String(form.get("cost") ?? "") || undefined,
    });
  }

  return Response.redirect(new URL("/admin/classes?saved=1", request.url), 303);
};
