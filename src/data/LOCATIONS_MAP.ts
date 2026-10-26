// Pin layout and link targets for the standalone /locations map
// (src/app/locations/page.tsx). Not derived from DEV_DATA.json because it
// needs two things that data doesn't carry: a screen position for each pin,
// and - for developments with a dedicated third-party sales/interactive
// site - an external URL instead of this site's own /developments/[id]
// page. Everything else (name, hero image, "at a glance" facts) is read
// live from the normal site data, so only this file needs updating if a
// pin's position or destination link changes.
//
// The map background is a real illustrated England map image
// (/uploads/locations-map-background.png, 1824x968), not a schematic -
// pin positions are fractional (0-1) coordinates within that image,
// calibrated against known real-world airport/city locations visible on
// it (Heathrow, Luton, Stansted, London City) via a linear lat/lon -> pixel
// fit, then converted to lat/lon for every development and back to pixel
// fractions. Bristol's three developments fall right at/past this
// particular crop's bottom-left edge (the image doesn't extend far enough
// south-west to show Bristol itself, only the Severn Estuary mouth
// leading to it) and are nudged to the visible corner rather than placed
// at their literal (off-canvas) computed position.

export interface LocationPin {
  id: string;
  x: number;
  y: number;
  href: string;
  external: boolean;
}

export const LOCATIONS: LocationPin[] = [
  // London
  { id: "lampton-parkside", x: 0.7346, y: 0.8072, href: "https://lamptonparkside.millerhare.com/", external: true },
  { id: "kew-bridge-rise", x: 0.7504, y: 0.7970, href: "https://kewbridgerise.millerhare.com/", external: true },
  { id: "north-gate-park", x: 0.8046, y: 0.7253, href: "https://tekuchiapps.com/northgatepark/home", external: true },
  { id: "dagenham-green", x: 0.8752, y: 0.7457, href: "https://tekuchiapps.com/dagenhamgreen/login", external: true },
  { id: "wembley", x: 0.7570, y: 0.7444, href: "/developments/wembley", external: false },
  { id: "dollis-hill", x: 0.7673, y: 0.7439, href: "/developments/dollis-hill", external: false },
  { id: "ham-richmond", x: 0.7504, y: 0.8333, href: "/developments/ham-richmond", external: false },
  { id: "woolwich", x: 0.8507, y: 0.7931, href: "/developments/woolwich", external: false },
  { id: "colindale", x: 0.7652, y: 0.7147, href: "/developments/colindale", external: false },
  { id: "langdon-park", x: 0.8319, y: 0.7749, href: "/developments/langdon-park", external: false },
  { id: "barnet", x: 0.7791, y: 0.6719, href: "/developments/barnet", external: false },
  { id: "hoxton", x: 0.8117, y: 0.7623, href: "/developments/hoxton", external: false },

  // Buckinghamshire / Hertfordshire
  { id: "little-chalfont-park", x: 0.6755, y: 0.6611, href: "/developments/little-chalfont-park", external: false },
  { id: "millside-grange", x: 0.7107, y: 0.6750, href: "/developments/millside-grange", external: false },
  { id: "nexus", x: 0.7771, y: 0.4841, href: "https://tekuchiapps.com/nexus", external: true },

  // Cambridgeshire cluster
  { id: "farehurst-park", x: 0.8856, y: 0.2705, href: "/developments/farehurst-park", external: false },
  { id: "the-icon", x: 0.8666, y: 0.2427, href: "/developments/the-icon", external: false },
  { id: "knights-park", x: 0.8674, y: 0.2407, href: "https://knightspark.millerhare.com/", external: true },
  { id: "city-reach", x: 0.8670, y: 0.2596, href: "/developments/city-reach", external: false },
  { id: "hartmere", x: 0.8726, y: 0.2672, href: "https://hartmere.millerhare.com/", external: true },
  { id: "fitzwilliam-gate", x: 0.8711, y: 0.2445, href: "/developments/fitzwilliam-gate", external: false },
  { id: "marleigh-park", x: 0.8794, y: 0.2498, href: "https://marleigh.millerhare.com/", external: true },
  { id: "cambium-square", x: 0.8166, y: 0.2378, href: "https://sales-cambiumsquare.pixeldigital.ltd/", external: true },

  // Oxford
  { id: "canalside-quarter", x: 0.4871, y: 0.5832, href: "https://canalside-overseas.netlify.app/", external: true },

  // Bristol (nudged onto the visible corner - see file header)
  { id: "clifton-collection", x: 0.022, y: 0.890, href: "https://thecliftoncollection.millerhare.com/", external: true },
  { id: "baltic-wharf", x: 0.030, y: 0.905, href: "/developments/baltic-wharf", external: false },
  { id: "southville-collection", x: 0.038, y: 0.920, href: "/developments/southville-collection", external: false },

  // West Midlands
  { id: "ribbon-quarter", x: 0.4157, y: 0.1039, href: "/developments/ribbon-quarter", external: false },
];
