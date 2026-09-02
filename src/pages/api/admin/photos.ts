import type { APIRoute } from "astro";
import { deletePhoto, upsertPhoto } from "../../../lib/content";
import { processUpload } from "../../../lib/images";
import type { Photo } from "../../../lib/types";

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const action = String(form.get("action") ?? "save");
    const id = String(form.get("id") ?? "");

    if (action === "delete") {
      if (id) await deletePhoto(id);
      return Response.redirect(new URL("/admin/photos?saved=1", request.url), 303);
    }

    const file = form.get("file");
    const processed = file instanceof File ? await processUpload(file) : null;

    await upsertPhoto({
      id: id || undefined,
      gallery: String(form.get("gallery") ?? "student") as Photo["gallery"],
      caption: String(form.get("caption") ?? ""),
      alt: String(form.get("alt") ?? ""),
      indexLabel: String(form.get("indexLabel") ?? ""),
      file: processed,
    });

    return Response.redirect(new URL("/admin/photos?saved=1", request.url), 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save that photograph.";
    return Response.redirect(
      new URL(`/admin/photos?error=${encodeURIComponent(message)}`, request.url),
      303,
    );
  }
};
