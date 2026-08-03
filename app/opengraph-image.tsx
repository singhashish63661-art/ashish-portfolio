import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Ashish Singh — Product and Web Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 42%, #7c2d12 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 12,
              height: 48,
              borderRadius: 6,
              background: "#f97316",
            }}
          />
          <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.9 }}>
            Portfolio
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Ashish Singh</div>
          <div style={{ fontSize: 30, fontWeight: 600, opacity: 0.92, maxWidth: 900, lineHeight: 1.35 }}>
            Product and web builder for operations, dashboards, and client websites
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 22, opacity: 0.85 }}>
          <span>GPS &amp; IVMS · Dashboards · Client websites</span>
          <span style={{ fontWeight: 700, color: "#c4b5fd" }}>ashish-portfolio</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
