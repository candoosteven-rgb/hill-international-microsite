import type { Metadata } from "next";

const MAP_SRC = "https://d3bbhh59zbi48e.cloudfront.net/";

// Intentionally not linked from Nav/Footer and excluded from indexing -
// this is a standalone, unlisted page.
export const metadata: Metadata = {
  title: "Locations",
  robots: { index: false, follow: false },
};

export default function LocationsPage() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <iframe
        src={MAP_SRC}
        title="Locations map"
        style={{ width: "100%", height: "100%", border: "none" }}
        allowFullScreen
      />
      <a
        href={MAP_SRC}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          padding: "6px 12px",
          fontFamily: "system-ui, sans-serif",
          fontSize: 13,
          background: "rgba(255,255,255,0.92)",
          color: "#1F3A47",
          borderRadius: 6,
          textDecoration: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        Open in new tab ↗
      </a>
      <noscript>
        <a href={MAP_SRC}>View the locations map</a>
      </noscript>
    </div>
  );
}
