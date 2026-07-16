import { ImageResponse } from "next/og";
import { personal } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0b0b12 0%, #1a1230 45%, #0b1a2b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            opacity: 0.7,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {personal.title}
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 20 }}>
          {personal.name}
        </div>
        <div style={{ fontSize: 32, marginTop: 24, opacity: 0.85 }}>
          {personal.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
