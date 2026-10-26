import type { Metadata } from "next";
import LocationsMap from "@/components/LocationsMap";

// Intentionally not linked from Nav/Footer and excluded from indexing -
// this is a standalone, unlisted page.
export const metadata: Metadata = {
  title: "Locations",
  robots: { index: false, follow: false },
};

export default function LocationsPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <LocationsMap />
    </div>
  );
}
