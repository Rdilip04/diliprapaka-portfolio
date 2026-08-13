import { ImageResponse } from "next/og";

export const alt = "Dilip Rapaka — Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#f4f4f2",
          color: "#14181f",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#5b6572",
          }}
        >
          Product Designer · UK
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              gap: 24,
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            <span>Dilip</span>
            <span style={{ color: "#2521b0" }}>Rapaka</span>
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 880,
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(20,24,31,0.7)",
            }}
          >
            Calm, usable products for people navigating complex digital
            environments.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
