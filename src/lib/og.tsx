import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// The brain orb, inlined so the build-time renderer needs no network.
const ORB = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/brand/business-brain-orb-tight.png")).toString("base64")}`;

/** 1200x630 share card in brand colours (orange #FF6B2C, ink #0B0D12). Rendered at build time. */
export function ogCard({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0B0D12", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={ORB} width={48} height={48} />
          <div style={{ fontSize: 30, fontWeight: 600 }}>Business Brain</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, color: "#FF6B2C" }}>{eyebrow}</div>
          <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.08, letterSpacing: -2, marginTop: 14, maxWidth: 1000 }}>{title}</div>
          {sub && <div style={{ fontSize: 28, color: "rgba(255,255,255,0.65)", marginTop: 22, maxWidth: 980, lineHeight: 1.35 }}>{sub}</div>}
        </div>
      </div>
    ),
    ogSize,
  );
}
