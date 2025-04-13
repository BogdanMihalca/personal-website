import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(45deg, #050505, #101010)",
            boxShadow: "inset 0 0 10px #b400ff",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(90deg, transparent 95%, #b400ff 95%), linear-gradient(transparent 95%, #b400ff 95%)",
            backgroundSize: "8px 8px",
            opacity: 0.3,
            zIndex: 2,
          }}
        />

        <div
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#fff",
            textShadow: "0 0 5px #b400ff, 0 0 10px #b400ff",
            border: "2px solid #b400ff",
            padding: "3px 6px",
            background: "rgba(0, 0, 0, 0.7)",
            boxShadow: "0 0 8px #b400ff",
            letterSpacing: "2px",
            zIndex: 3,
            transform: "skew(-5deg)",
          }}
        >
          B
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
