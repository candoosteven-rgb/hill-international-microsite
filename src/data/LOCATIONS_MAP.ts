// Pin layout and link targets for the standalone /locations map
// (src/app/locations/page.tsx). Not derived from DEV_DATA.json because it
// needs two things that data doesn't carry: a screen position for each pin,
// and - for developments with a dedicated third-party sales/interactive
// site - an external URL instead of this site's own /developments/[id]
// page. Everything else (name, hero image, "at a glance" facts) is read
// live from the normal site data, so only this file needs updating if a
// pin's position or destination link changes.
//
// Pin position is a fractional (0-1) coordinate within the map area,
// projected from real-world lat/lon onto a fixed England bounding box
// (lon -2.70..0.25, lat 51.40..52.50) - this is a schematic placement, not
// a precise georeferenced map. The tight Cambridge/Cambridgeshire cluster
// (7 developments within a few miles of each other) is manually fanned out
// for legibility rather than left to overlap exactly.

export interface LocationPin {
  id: string;
  x: number;
  y: number;
  href: string;
  external: boolean;
}

export const LOCATIONS: LocationPin[] = [
  // London
  { id: "lampton-parkside", x: 0.793, y: 0.934, href: "https://lamptonparkside.millerhare.com/", external: true },
  { id: "kew-bridge-rise", x: 0.812, y: 0.922, href: "https://kewbridgerise.millerhare.com/", external: true },
  { id: "north-gate-park", x: 0.879, y: 0.836, href: "https://tekuchiapps.com/northgatepark/home", external: true },
  { id: "dagenham-green", x: 0.966, y: 0.860, href: "https://tekuchiapps.com/dagenhamgreen/login", external: true },
  { id: "wembley", x: 0.821, y: 0.859, href: "/developments/wembley", external: false },
  { id: "dollis-hill", x: 0.833, y: 0.858, href: "/developments/dollis-hill", external: false },
  { id: "ham-richmond", x: 0.812, y: 0.966, href: "/developments/ham-richmond", external: false },
  { id: "woolwich", x: 0.936, y: 0.917, href: "/developments/woolwich", external: false },
  { id: "colindale", x: 0.831, y: 0.823, href: "/developments/colindale", external: false },
  { id: "langdon-park", x: 0.913, y: 0.895, href: "/developments/langdon-park", external: false },
  { id: "barnet", x: 0.848, y: 0.771, href: "/developments/barnet", external: false },
  { id: "hoxton", x: 0.888, y: 0.880, href: "/developments/hoxton", external: false },

  // Buckinghamshire / Hertfordshire
  { id: "little-chalfont-park", x: 0.720, y: 0.758, href: "/developments/little-chalfont-park", external: false },
  { id: "millside-grange", x: 0.763, y: 0.775, href: "/developments/millside-grange", external: false },
  { id: "nexus", x: 0.845, y: 0.544, href: "https://tekuchiapps.com/nexus", external: true },

  // Cambridgeshire cluster (fanned out for legibility, see file header)
  { id: "farehurst-park", x: 0.958, y: 0.230, href: "/developments/farehurst-park", external: false },
  { id: "the-icon", x: 0.935, y: 0.250, href: "/developments/the-icon", external: false },
  { id: "knights-park", x: 0.935, y: 0.270, href: "https://knightspark.millerhare.com/", external: true },
  { id: "city-reach", x: 0.975, y: 0.250, href: "/developments/city-reach", external: false },
  { id: "hartmere", x: 0.975, y: 0.270, href: "https://hartmere.millerhare.com/", external: true },
  { id: "fitzwilliam-gate", x: 0.955, y: 0.290, href: "/developments/fitzwilliam-gate", external: false },
  { id: "marleigh-park", x: 0.985, y: 0.290, href: "https://marleigh.millerhare.com/", external: true },
  { id: "cambium-square", x: 0.894, y: 0.246, href: "https://sales-cambiumsquare.pixeldigital.ltd/", external: true },

  // Oxford
  { id: "canalside-quarter", x: 0.488, y: 0.664, href: "https://canalside-overseas.netlify.app/", external: true },

  // Bristol
  { id: "clifton-collection", x: 0.028, y: 0.943, href: "https://thecliftoncollection.millerhare.com/", external: true },
  { id: "baltic-wharf", x: 0.032, y: 0.956, href: "/developments/baltic-wharf", external: false },
  { id: "southville-collection", x: 0.032, y: 0.961, href: "/developments/southville-collection", external: false },

  // West Midlands
  { id: "ribbon-quarter", x: 0.400, y: 0.085, href: "/developments/ribbon-quarter", external: false },
];

export const REGION_LABELS: { label: string; x: number; y: number }[] = [
  { label: "WEST MIDLANDS", x: 0.40, y: 0.045 },
  { label: "CAMBRIDGESHIRE", x: 0.90, y: 0.175 },
  { label: "OXFORDSHIRE", x: 0.46, y: 0.615 },
  { label: "BUCKINGHAMSHIRE", x: 0.655, y: 0.695 },
  { label: "HERTFORDSHIRE", x: 0.795, y: 0.495 },
  { label: "LONDON", x: 0.84, y: 0.965 },
  { label: "BRISTOL", x: 0.075, y: 0.875 },
];

// Soft ellipses centred on each pin cluster, purely to give the schematic
// map some visual landmass structure (see LocationsMap.tsx) - not a real
// county boundary.
export const REGION_BLOBS: { label: string; x: number; y: number; w: number; h: number }[] = [
  { label: "west-midlands", x: 0.40, y: 0.085, w: 0.16, h: 0.14 },
  { label: "cambridgeshire", x: 0.955, y: 0.26, w: 0.19, h: 0.14 },
  { label: "oxfordshire", x: 0.488, y: 0.664, w: 0.14, h: 0.12 },
  { label: "buckinghamshire", x: 0.74, y: 0.765, w: 0.17, h: 0.14 },
  { label: "hertfordshire", x: 0.845, y: 0.544, w: 0.14, h: 0.12 },
  { label: "london", x: 0.86, y: 0.88, w: 0.24, h: 0.22 },
  { label: "bristol", x: 0.03, y: 0.952, w: 0.16, h: 0.14 },
];

