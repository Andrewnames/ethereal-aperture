import { randomUUID } from "node:crypto";
import { query } from "./db";
import type { ContactInquiry, ContactStatus } from "./types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATUSES: ContactStatus[] = ["new", "replied", "archived"];

function clip(value: string, max: number) {
  return value.trim().slice(0, max);
}

function mapRow(row: {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  source: string;
  status: string;
  notes: string;
  created_at: Date | string;
}): ContactInquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    interest: row.interest,
    message: row.message,
    source: row.source,
    status: STATUSES.includes(row.status as ContactStatus)
      ? (row.status as ContactStatus)
      : "new",
    notes: row.notes,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
  };
}

export function parseInquiry(form: FormData) {
  if (String(form.get("website") ?? "").trim()) {
    return { spam: true as const };
  }

  const name = clip(String(form.get("name") ?? ""), 120);
  const email = clip(String(form.get("email") ?? ""), 200);
  const phone = clip(String(form.get("phone") ?? ""), 40);
  const interest = clip(String(form.get("interest") ?? ""), 160);
  const message = clip(String(form.get("message") ?? ""), 4000);
  const source = clip(String(form.get("source") ?? "site"), 40) || "site";

  if (!name || !EMAIL.test(email) || !message) {
    return { error: "invalid" as const };
  }

  return {
    name,
    email,
    phone,
    interest,
    message,
    source,
  };
}

export async function createInquiry(
  input: Omit<ContactInquiry, "id" | "status" | "notes" | "createdAt">,
) {
  const id = randomUUID();
  await query(
    `INSERT INTO contacts (id, name, email, phone, interest, message, source)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      id,
      input.name,
      input.email,
      input.phone,
      input.interest,
      input.message,
      input.source,
    ],
  );
  return id;
}

export async function listInquiries(status?: ContactStatus) {
  const result = status
    ? await query(
        `SELECT * FROM contacts WHERE status = $1 ORDER BY created_at DESC`,
        [status],
      )
    : await query(`SELECT * FROM contacts ORDER BY created_at DESC`);
  return result.rows.map((row) => mapRow(row as Parameters<typeof mapRow>[0]));
}

export async function countNewInquiries() {
  const result = await query<{ n: number }>(
    `SELECT COUNT(*)::int AS n FROM contacts WHERE status = 'new'`,
  );
  return result.rows[0]?.n ?? 0;
}

export async function updateInquiry(
  id: string,
  input: { status: ContactStatus; notes: string },
) {
  await query(`UPDATE contacts SET status = $2, notes = $3 WHERE id = $1`, [
    id,
    input.status,
    clip(input.notes, 4000),
  ]);
}

export async function deleteInquiry(id: string) {
  await query(`DELETE FROM contacts WHERE id = $1`, [id]);
}

export function isContactStatus(value: string): value is ContactStatus {
  return STATUSES.includes(value as ContactStatus);
}
