import type { APIRoute } from "astro";
import {
  deleteInquiry,
  isContactStatus,
  updateInquiry,
} from "../../../lib/contacts";
import { publicUrl } from "../../../lib/http";

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  const action = String(form.get("action") ?? "save");
  const filter = String(form.get("filter") ?? "");
  const back =
    filter && isContactStatus(filter)
      ? `/admin/contacts?status=${filter}&saved=1`
      : "/admin/contacts?saved=1";

  if (!id) {
    return Response.redirect(publicUrl(back, request), 303);
  }

  if (action === "delete") {
    await deleteInquiry(id);
  } else {
    const status = String(form.get("status") ?? "new");
    await updateInquiry(id, {
      status: isContactStatus(status) ? status : "new",
      notes: String(form.get("notes") ?? ""),
    });
  }

  return Response.redirect(publicUrl(back, request), 303);
};
