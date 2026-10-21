import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #E5C0BA 0%, #F4E2DF 50%, #FCF8F7 100%)",
        fontFamily: "serif",
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: "#1F191B",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Style By Fiza
      </div>
      <div
        style={{
          fontSize: 22,
          color: "#A85A50",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          opacity: 0.95,
        }}
      >
        Online Ready to Wear
      </div>
      <div
        style={{
          marginTop: 36,
          width: 90,
          height: 2,
          background: "#C9968F",
          opacity: 0.8,
        }}
      />
    </div>,
    { ...size },
  );
}
