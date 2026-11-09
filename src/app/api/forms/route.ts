import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

// Every website form posts here. Each submission is:
//   1. saved as a private JSON file in Vercel Blob (needs BLOB_READ_WRITE_TOKEN — created by connecting a Blob store to the project), and
//   2. emailed to the office via Resend (needs RESEND_API_KEY).
// The visitor sees success if at least one of those worked; if both fail they are told to call the office.

const RECIPIENTS = (process.env.FORM_RECIPIENTS ?? "takur01@yahoo.com,lokesh.tamiri@niravana.in")
  .split(",").map((s) => s.trim()).filter(Boolean);
// Must be on a domain verified in Resend.
const FROM = process.env.FORM_FROM ?? "Heartcare4Life Website <forms@heartcare4life.com>";

const KIND_LABELS: Record<string, string> = {
  appointment: "Online appointment request",
  "general-appointment": "General appointment request",
  contact: "Contact message",
  feedback: "Website feedback",
  "tell-a-friend": "Tell-a-friend",
  testimonial: "Testimonial submission",
};

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const humanize = (k: string) => k.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());

async function save(id: string, record: Record<string, unknown>) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN not set");
  await put(`form-submissions/${id}.json`, JSON.stringify(record, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

async function email(kind: string, fields: Record<string, string>, receivedAt: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");
  const label = KIND_LABELS[kind] ?? `Form: ${kind}`;
  const who = fields.name || fields.yourName || "";
  const replyTo = fields.email || fields.yourEmail;
  const rows = Object.entries(fields)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;font-weight:bold;white-space:nowrap">${esc(humanize(k))}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("");
  const text = Object.entries(fields).map(([k, v]) => `${humanize(k)}: ${v}`).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: RECIPIENTS,
      subject: `${label}${who ? ` from ${who}` : ""}`,
      ...(replyTo && /^\S+@\S+\.\S+$/.test(replyTo) ? { reply_to: replyTo } : {}),
      html: `<h2 style="font-family:sans-serif">${esc(label)}</h2><table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows}</table><p style="font-family:sans-serif;font-size:12px;color:#666">Received ${esc(receivedAt)} via heartcare4life.com</p>`,
      text: `${label}\n\n${text}\n\nReceived ${receivedAt} via heartcare4life.com`,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ ok: false }, { status: 400 });
  if (body.website) return NextResponse.json({ ok: true }); // honeypot

  const kind = typeof body.kind === "string" ? body.kind.slice(0, 50) : "unknown";
  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries(body)) {
    if (k === "kind" || k === "website" || typeof v !== "string") continue;
    fields[k.slice(0, 50)] = v.slice(0, 5000);
  }

  const receivedAt = new Date().toISOString();
  const id = `${receivedAt.replace(/[:.]/g, "-")}-${kind}-${crypto.randomUUID().slice(0, 8)}`;
  const [saved, emailed] = await Promise.allSettled([
    save(id, { id, kind, receivedAt, fields }),
    email(kind, fields, receivedAt),
  ]);

  // Log outcomes only — never the submission contents (may contain patient information).
  if (saved.status === "rejected") console.error("[form] save failed", id, String(saved.reason));
  if (emailed.status === "rejected") console.error("[form] email failed", id, String(emailed.reason));
  if (saved.status === "rejected" && emailed.status === "rejected") return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}
