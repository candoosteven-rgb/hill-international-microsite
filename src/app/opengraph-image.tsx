import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// Required for output:"export" - this route has no per-request variation,
// so it's pre-rendered once at build time into a static image file.
export const dynamic = "force-static";
export const alt = "Hill International — new homes across London, the Home Counties and South of England";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const heroPath = join(process.cwd(), "public/uploads/opt/london-skyline.jpg");
  const heroBase64 = `data:image/jpeg;base64,${readFileSync(heroPath).toString("base64")}`;

  const logoPath = join(process.cwd(), "public/uploads/hill-logo-transparent.png");
  const logoBase64 = `data:image/png;base64,${readFileSync(logoPath).toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0E2028" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroBase64}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(0deg, rgba(9,19,25,0.96) 0%, rgba(9,19,25,0.62) 42%, rgba(9,19,25,0.28) 100%)",
          }}
        />
        <div style={{ position: "absolute", top: 56, left: 64, display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoBase64} alt="" width={168} height={38} />
        </div>
        <div style={{ position: "absolute", bottom: 68, left: 64, right: 64, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 62, fontWeight: 800, color: "#F9F5F3", letterSpacing: "-2px" }}>
            Hill International
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "rgba(249,245,243,0.86)", marginTop: 18 }}>
            New homes across London, the Home Counties &amp; South of England
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
