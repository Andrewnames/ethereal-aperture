export function publicUrl(path: string, request: Request) {
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    "ethereal-aperture.onrender.com";
  return new URL(path, `${proto}://${host}`);
}
