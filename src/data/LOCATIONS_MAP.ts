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
// fractions. Where a development's real sales-suite address or postcode is
// known (from PAGE_DATA_FULL.json's `suite` field, or geocoded against an
// official Hill location map), that real-world point is run through the
// same fit in preference to a rough guess.

export interface LocationPin {
  id: string;
  x: number;
  y: number;
  href: string;
  external: boolean;
}

export const LOCATIONS: LocationPin[] = [
  // London
  { id: "lampton-parkside", x: 0.7332, y: 0.8058, href: "https://lamptonparkside.millerhare.com/", external: true },
  { id: "kew-bridge-rise", x: 0.7552, y: 0.7933, href: "https://kewbridgerise.millerhare.com/", external: true },
  { id: "north-gate-park", x: 0.8085, y: 0.7250, href: "https://tekuchiapps.com/northgatepark/home", external: true },
  { id: "dagenham-green", x: 0.8752, y: 0.7457, href: "https://tekuchiapps.com/dagenhamgreen/login", external: true },
  { id: "wembley", x: 0.7569, y: 0.7385, href: "/developments/wembley", external: false },
  { id: "dollis-hill", x: 0.7695, y: 0.7381, href: "/developments/dollis-hill", external: false },
  { id: "ham-richmond", x: 0.7494, y: 0.8345, href: "/developments/ham-richmond", external: false },
  { id: "woolwich", x: 0.8513, y: 0.7953, href: "/developments/woolwich", external: false },
  { id: "colindale", x: 0.7651, y: 0.7144, href: "/developments/colindale", external: false },
  { id: "langdon-park", x: 0.8319, y: 0.7749, href: "/developments/langdon-park", external: false },
  { id: "barnet", x: 0.7789, y: 0.6734, href: "/developments/barnet", external: false },
  { id: "hoxton", x: 0.8115, y: 0.7656, href: "/developments/hoxton", external: false },

  // Buckinghamshire / Hertfordshire
  { id: "little-chalfont-park", x: 0.6814, y: 0.6690, href: "/developments/little-chalfont-park", external: false },
  { id: "millside-grange", x: 0.7107, y: 0.6750, href: "/developments/millside-grange", external: false },
  { id: "nexus", x: 0.7754, y: 0.4867, href: "https://tekuchiapps.com/nexus", external: true },

  // Cambridgeshire cluster
  { id: "farehurst-park", x: 0.8856, y: 0.2705, href: "/developments/farehurst-park", external: false },
  { id: "the-icon", x: 0.8580, y: 0.2448, href: "/developments/the-icon", external: false },
  // Shares Knights Park's own sales suite address (Eddington Avenue) - offset
  // a touch so the two pins don't land exactly on top of one another.
  { id: "knights-park", x: 0.8593, y: 0.2461, href: "https://knightspark.millerhare.com/", external: true },
  { id: "city-reach", x: 0.8733, y: 0.2665, href: "/developments/city-reach", external: false },
  { id: "hartmere", x: 0.8755, y: 0.2805, href: "https://hartmere.millerhare.com/", external: true },
  { id: "fitzwilliam-gate", x: 0.8711, y: 0.2445, href: "/developments/fitzwilliam-gate", external: false },
  { id: "marleigh-park", x: 0.8841, y: 0.2504, href: "https://marleigh.millerhare.com/", external: true },
  { id: "cambium-square", x: 0.8166, y: 0.2378, href: "https://sales-cambiumsquare.pixeldigital.ltd/", external: true },

  // Oxford
  { id: "canalside-quarter", x: 0.4767, y: 0.5982, href: "https://canalside-overseas.netlify.app/", external: true },

  // Bristol
  { id: "clifton-collection", x: 0.1134, y: 0.8142, href: "https://thecliftoncollection.millerhare.com/", external: true },
  { id: "baltic-wharf", x: 0.1169, y: 0.8254, href: "/developments/baltic-wharf", external: false },
  { id: "southville-collection", x: 0.1169, y: 0.8294, href: "/developments/southville-collection", external: false },

  // West Midlands
  { id: "ribbon-quarter", x: 0.4183, y: 0.1053, href: "/developments/ribbon-quarter", external: false },
];
