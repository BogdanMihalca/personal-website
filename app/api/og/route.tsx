/** @jsxImportSource react */
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Blog Post";
    const subtitle = searchParams.get("subtitle") || "";
    const category = searchParams.get("category") || "";

    return new ImageResponse(
      (
        <div
          style={{
            background:
              "linear-gradient(135deg, #0f0f23 0%, #1a1a40 50%, #0f0f23 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              background:
                "radial-gradient(circle at 30% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            }}
          />

          {/* Grid pattern */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              backgroundImage:
                "linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "80px",
              zIndex: 1,
            }}
          >
            {category && (
              <div
                style={{
                  backgroundColor: "rgba(147, 51, 234, 0.2)",
                  border: "1px solid rgba(147, 51, 234, 0.4)",
                  color: "#a855f7",
                  padding: "8px 20px",
                  borderRadius: "20px",
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "30px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {category}
              </div>
            )}

            <h1
              style={{
                fontSize: "72px",
                fontWeight: "800",
                color: "#ffffff",
                lineHeight: "1.1",
                marginBottom: "20px",
                textShadow: "0 0 20px rgba(147, 51, 234, 0.5)",
                maxWidth: "900px",
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <p
                style={{
                  fontSize: "28px",
                  color: "#a1a1aa",
                  lineHeight: "1.4",
                  fontWeight: "400",
                  maxWidth: "800px",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Bottom decoration */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "60px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#a855f7",
                borderRadius: "50%",
                boxShadow: "0 0 10px rgba(168, 85, 247, 0.8)",
              }}
            />
            <span
              style={{
                color: "#71717a",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              Your Website Name
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response("Failed to generate the image", {
      status: 500,
    });
  }
}
