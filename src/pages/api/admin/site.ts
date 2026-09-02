import type { APIRoute } from "astro";
import { getSite, saveSite } from "../../../lib/content";

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const current = await getSite();
  const paragraphs = String(form.get("aboutParagraphs") ?? "")
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  await saveSite({
    ...current,
    title: String(form.get("title") ?? current.title),
    description: String(form.get("description") ?? current.description),
    wordmark: String(form.get("wordmark") ?? current.wordmark),
    searchable: form.get("searchable") === "on",
    email: String(form.get("email") ?? current.email),
    links: {
      instagramEa: String(form.get("instagramEa") ?? current.links.instagramEa),
      instagramCara: String(form.get("instagramCara") ?? current.links.instagramCara),
      halideUrl: String(form.get("halideUrl") ?? current.links.halideUrl),
      halideLabel: String(form.get("halideLabel") ?? current.links.halideLabel),
    },
    about: {
      ...current.about,
      draft: form.get("aboutDraft") === "on",
      pull: String(form.get("aboutPull") ?? current.about.pull),
      portraitCaption: String(form.get("portraitCaption") ?? current.about.portraitCaption),
      paragraphs: paragraphs.length ? paragraphs : current.about.paragraphs,
    },
    artistStatement: {
      pull: String(form.get("artistPull") ?? current.artistStatement.pull),
      note: String(form.get("artistNote") ?? current.artistStatement.note),
      rotation: String(form.get("artistRotation") ?? current.artistStatement.rotation),
    },
  });

  return Response.redirect(new URL("/admin?saved=1", request.url), 303);
};
