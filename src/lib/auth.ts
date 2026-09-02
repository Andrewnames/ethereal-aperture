import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "ea_admin";
const MAX_AGE = 60 * 60 * 24 * 14;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not set");
  return value;
}

export function adminPassword() {
  const value = process.env.ADMIN_PASSWORD;
  if (!value) throw new Error("ADMIN_PASSWORD is not set");
  return value;
}

export function passwordsMatch(input: string) {
  const expected = Buffer.from(adminPassword());
  const given = Buffer.from(input);
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

export function createSession() {
  const exp = Date.now() + MAX_AGE * 1000;
  const body = String(exp);
  const sig = createHmac("sha256", secret()).update(body).digest("hex");
  return `${body}.${sig}`;
}

export function sessionValid(raw: string | undefined) {
  if (!raw) return false;
  const [body, sig] = raw.split(".");
  if (!body || !sig) return false;
  const expected = createHmac("sha256", secret()).update(body).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(body) > Date.now();
}

export function readSessionCookie(cookieHeader: string | null) {
  if (!cookieHeader) return undefined;
  const parts = cookieHeader.split(";").map((part) => part.trim());
  const found = parts.find((part) => part.startsWith(`${COOKIE}=`));
  return found?.slice(COOKIE.length + 1);
}

export function sessionCookie(value: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}
