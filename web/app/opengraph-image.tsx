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
        background: "linear-gradient(135deg, #3C1418 0%, #5E1F28 50%, #200B10 100%)",
        fontFamily: "serif",
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: "#E0A8A6",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Style By Fiza
      </div>
      <div
        style={{
          fontSize: 22,
          color: "#FDF9F8",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          opacity: 0.9,
        }}
      >
        Online Ready to Wear
      </div>
      <div
        style={{
          marginTop: 36,
          width: 90,
          height: 2,
          background: "#C88785",
          opacity: 0.7,
        }}
      />
    </div>,
    { ...size },
  );
}
