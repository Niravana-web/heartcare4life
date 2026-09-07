import { ImageResponse } from "next/og";
import { SITE, DOCTOR } from "@/lib/site";

export const runtime = "nodejs";

const CREAM = "#f4eee0";
const NAVY = "#152030";
const MUTED = "#5d6470";

/** Social preview card. Called as /og?t=<title>&s=<section label>. */
export function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const title = (q.get("t") ?? SITE.name).slice(0, 90);
  const eyebrow = (q.get("s") ?? "Cardiology").slice(0, 40);

  // The output is a pure function of t and s, so it can cache hard. Without this
  // every social crawler and repeat fetch re-renders the PNG on the server.
  const headers = { "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable" };

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: CREAM, padding: "68px 76px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: MUTED }}>{eyebrow}</div>
          <div style={{ height: 3, width: 96, background: NAVY, marginTop: 22 }} />
        </div>
        <div style={{ display: "flex", fontSize: title.length > 42 ? 64 : 82, lineHeight: 1.08, color: NAVY, fontWeight: 600, maxWidth: 1010 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 34, color: NAVY, fontWeight: 600 }}>{DOCTOR.fullName}</div>
            <div style={{ fontSize: 24, color: MUTED, marginTop: 8 }}>Board Certified in Cardiology and Interventional Cardiology</div>
            <div style={{ fontSize: 24, color: MUTED, marginTop: 6 }}>Bonita · San Diego · Redding, California</div>
          </div>
          <div style={{ fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: MUTED }}>heartcare4life.com</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers },
  );
}
