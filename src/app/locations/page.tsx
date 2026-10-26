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
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Same chrome as the main site's Nav, minus the links/menu - this page
          has nothing to navigate to from here. */}
      <div
        className="sticky top-0 z-[90] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.06)]"
        style={{ background: "rgba(18,34,45,0.96)", backdropFilter: "blur(14px)" }}
      >
        <div className="mx-auto flex max-w-[1440px] items-center px-5 py-6 md:px-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/uploads/hill-logo-transparent.png" alt="Hill International" className="h-[36.4px] w-auto" />
        </div>
      </div>

      <p className="mx-auto max-w-[1440px] px-5 pb-5 pt-6 text-[14.5px] leading-relaxed text-[#5C6B71] md:px-10">
        Hover over a development to explore further. Click on a number or development name to visit its dedicated
        page or interactive experience.
      </p>

      <div style={{ height: "calc(100vh - 160px)" }}>
        <iframe src={MAP_SRC} title="Locations map" style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen />
      </div>
    </div>
  );
}
