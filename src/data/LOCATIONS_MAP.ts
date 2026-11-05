// Pin layout and link targets for the standalone /locations map
// (src/app/locations/page.tsx). Not derived from DEV_DATA.json because it
// needs - for developments with a dedicated third-party sales/interactive
// site - an external URL instead of this site's own /developments/[id]
// page. Everything else (name, hero image, "at a glance" facts) is read
// live from the normal site data, so only this file needs updating if a
// pin's real-world location or destination link changes.
//
// lat/lng are real-world coordinates (the map itself is Mapbox GL, not an
// illustration) - sourced from each development's actual sales-suite
// address where known (PAGE_DATA_FULL.json's `suite` field), or geocoded
// from its postcode/place name otherwise.

export interface LocationPin {
  id: string;
  lat: number;
  lng: number;
  href: string;
  external: boolean;
}

export const LOCATIONS: LocationPin[] = [
  // London
  { id: "lampton-parkside", lat: 51.4741, lng: -0.36594, href: "https://lamptonparkside.millerhare.com/", external: true },
  { id: "kew-bridge-rise", lat: 51.49071, lng: -0.286, href: "https://kewbridgerise.millerhare.com/", external: true },
  { id: "north-gate-park", lat: 51.58148, lng: -0.09234, href: "https://tekuchiapps.com/northgatepark/home", external: true },
  { id: "dagenham-green", lat: 51.55397, lng: 0.15001, href: "https://tekuchiapps.com/dagenhamgreen/login", external: true },
  { id: "wembley", lat: 51.56354, lng: -0.27983, href: "/developments/wembley", external: false },
  { id: "dollis-hill", lat: 51.56407, lng: -0.23405, href: "/developments/dollis-hill", external: false },
  { id: "ham-richmond", lat: 51.43596, lng: -0.30708, href: "/developments/ham-richmond", external: false },
  { id: "woolwich", lat: 51.48805, lng: 0.06317, href: "/developments/woolwich", external: false },
  { id: "colindale", lat: 51.59556, lng: -0.25003, href: "/developments/colindale", external: false },
  { id: "langdon-park", lat: 51.51516, lng: -0.00732, href: "/developments/langdon-park", external: false },
  { id: "barnet", lat: 51.65005, lng: -0.19989, href: "/developments/barnet", external: false },
  { id: "hoxton", lat: 51.52752, lng: -0.08144, href: "/developments/hoxton", external: false },

  // Buckinghamshire / Hertfordshire
  { id: "little-chalfont-park", lat: 51.6559, lng: -0.55415, href: "/developments/little-chalfont-park", external: false },
  { id: "millside-grange", lat: 51.64792, lng: -0.44769, href: "/developments/millside-grange", external: false },
  { id: "nexus", lat: 51.89816, lng: -0.21261, href: "https://tekuchiapps.com/nexus", external: true },

  // Cambridgeshire cluster
  { id: "farehurst-park", lat: 52.18548, lng: 0.1878, href: "/developments/farehurst-park", external: false },
  { id: "the-icon", lat: 52.21963, lng: 0.08752, href: "/developments/the-icon", external: false },
  { id: "knights-park", lat: 52.21791, lng: 0.09224, href: "https://knightspark.millerhare.com/", external: true },
  { id: "city-reach", lat: 52.1908, lng: 0.14311, href: "/developments/city-reach", external: false },
  { id: "hartmere", lat: 52.17219, lng: 0.1511, href: "https://hartmere.millerhare.com/", external: true },
  { id: "fitzwilliam-gate", lat: 52.22003, lng: 0.13512, href: "/developments/fitzwilliam-gate", external: false },
  { id: "marleigh-park", lat: 52.21219, lng: 0.18235, href: "https://marleigh.millerhare.com/", external: true },
  { id: "cambium-square", lat: 52.22894, lng: -0.06291, href: "https://sales-cambiumsquare.pixeldigital.ltd/", external: true },

  // Oxford
  { id: "canalside-quarter", lat: 51.74999, lng: -1.29792, href: "https://canalside-overseas.netlify.app/", external: true },

  // Bristol
  { id: "clifton-collection", lat: 51.46294, lng: -2.61796, href: "https://thecliftoncollection.millerhare.com/", external: true },
  { id: "baltic-wharf", lat: 51.44805, lng: -2.60525, href: "/developments/baltic-wharf", external: false },
  { id: "southville-collection", lat: 51.44274, lng: -2.60525, href: "/developments/southville-collection", external: false },

  // West Midlands
  { id: "ribbon-quarter", lat: 52.40502, lng: -1.51012, href: "/developments/ribbon-quarter", external: false },
];
