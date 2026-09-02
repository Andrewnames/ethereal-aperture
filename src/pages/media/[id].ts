import type { APIRoute } from "astro";
import { getPhotoFile } from "../../lib/content";

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return new Response("Not found", { status: 404 });

  const file = await getPhotoFile(id);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": file.mime || "image/webp",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
