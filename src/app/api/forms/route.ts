import { NextResponse } from "next/server";

// ponytail: forms are received and logged only. Wire to email (Resend/SendGrid) or the practice EHR intake before launch.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ ok: false }, { status: 400 });
  if (body.website) return NextResponse.json({ ok: true }); // honeypot
  console.log("[form]", JSON.stringify(body));
  return NextResponse.json({ ok: true });
}
