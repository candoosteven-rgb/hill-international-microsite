// "At a glance" replacement content for the developments covered by the
// October 2026 USP deck (USPs_from_deck_to_replace_USps_on_web.pptx) -
// transcribed from that deck's screenshots. Where a development has an
// entry here, DevelopmentPage renders this icon/USP panel instead of the
// old auto-generated facts grid; everything else keeps the old grid.
import type Icon from "@/components/Icon";

export interface UspItem {
  icon: Parameters<typeof Icon>[0]["name"];
  title: string;
  lines?: string[];
}

export interface UspPanel {
  eyebrow?: string;
  items: UspItem[];
}

export const USPS: Record<string, UspPanel> = {
  "kew-bridge-rise": {
    items: [
      { icon: "train", title: "Kew Bridge Station - 2 mins walk", lines: ["Waterloo - 29 mins by train"] },
      { icon: "walk", title: "Prime West London location", lines: ["The River Thames - 5 mins walk", "Kew Gardens - 10 mins walk"] },
      { icon: "cat_food", title: "Chiswick lifestyle", lines: ["Shops, restaurants & cafés within walking distance"] },
      { icon: "gym", title: "Resident amenities", lines: ["Concierge · Gym", "Co-working · Gardens"] },
      { icon: "f_price", title: "Rental yields up to 6.1%" },
      { icon: "medal", title: "Premium specification", lines: ["Private outdoor space to every apartment"] },
      { icon: "f_homes", title: "Only 45 homes remaining", lines: ["Approx. 80% sold"] },
    ],
  },

  "lampton-parkside": {
    eyebrow: "READY TO MOVE INTO",
    items: [
      { icon: "park", title: "Adjacent to 40 acres of parkland", lines: ["Tennis courts & playground"] },
      { icon: "walk", title: "Hounslow Central - 4 mins walk", lines: ["Piccadilly Line"] },
      { icon: "train", title: "South Kensington - under 30 mins", lines: ["direct by Tube"] },
      { icon: "train", title: "Heathrow Airport - approx. 10 mins", lines: ["direct by Tube"] },
      { icon: "school", title: "Excellent education", lines: ["Outstanding school next door", "Leading universities nearby"] },
      { icon: "f_price", title: "Rental yields up to 6.1%" },
      { icon: "medal", title: "Premium homes & amenities", lines: ["Concierge · Podium Gardens", "Private outdoor space"] },
    ],
  },

  "north-gate-park": {
    items: [
      { icon: "train", title: "Excellent transport connections", lines: ["Seven Sisters & Harringay nearby"] },
      { icon: "walk", title: "Green Lanes high street - 7 mins walk", lines: ["Shops · Restaurants · Cafés · Bars"] },
      { icon: "park", title: "3 acres of landscaped gardens", lines: ["Mature Mulberry Gardens"] },
      { icon: "f_homes", title: "995 new homes", lines: ["Apartments + future", "3 & 4 bed freehold houses"] },
      { icon: "cat_food", title: "Future on-site amenities", lines: ["Nursery · Supermarket", "Co-working · Café"] },
      { icon: "towers", title: "Major North London regeneration" },
      { icon: "f_price", title: "Rental yields up to 5.7%" },
    ],
  },

  "dagenham-green": {
    eyebrow: "READY TO MOVE INTO",
    items: [
      { icon: "towers", title: "Major Regeneration", lines: ["3,500-home new neighbourhood"] },
      { icon: "pin", title: "Next to Dagenham Dock station", lines: ["Fenchurch Street - 21 mins by train"] },
      { icon: "train", title: "Canary Wharf - 21 mins by train" },
      { icon: "park", title: "15 acres of green & public space" },
      { icon: "cat_food", title: "Extensive resident amenities", lines: ["Concierge · Sainsbury's", "Café · Gardens"] },
      { icon: "anchor", title: "London & Thames views", lines: ["From selected apartments"] },
      { icon: "f_price", title: "Rental yields up to 6.5%" },
    ],
  },

  nexus: {
    items: [
      { icon: "walk", title: "Stevenage Station - 5 mins walk", lines: ["King's Cross – 25 mins by train"] },
      { icon: "towers", title: "£1bn regeneration" },
      { icon: "pin", title: "Central location", lines: ["Between Old & New Town"] },
      { icon: "f_homes", title: "267 private homes", lines: ["Studios, 1, 2 & 3 beds"] },
      { icon: "f_tenure", title: "Proven BTR success", lines: ["3 buildings purchased by Lloyds Living"] },
      { icon: "f_price", title: "Rental yields up to 6.6%" },
      { icon: "medal", title: "High-spec homes", lines: ["Private outdoor space", "Selected green-space views"] },
      { icon: "f_parking", title: "Parking & EV charging", lines: ["Selected homes"] },
      { icon: "f_completion", title: "Estimated Completion", lines: ["Q1/Q2 2027"] },
    ],
  },

  "city-reach": {
    eyebrow: "READY TO MOVE INTO EARLY 2027",
    items: [
      { icon: "f_homes", title: "Just 39 private homes", lines: ["Exclusive 1 & 2 bed apartments"] },
      { icon: "pin", title: "Central Cambridge location", lines: ["City centre - 25 mins walk"] },
      { icon: "walk", title: "Cambridge Station - 16 mins walk" },
      { icon: "school", title: "World-class education nearby", lines: ["University colleges & leading schools"] },
      { icon: "cat_food", title: "Excellent local lifestyle", lines: ["Mill Road · Leisure Park · Amenities"] },
      { icon: "cat_fitness", title: "Green surroundings", lines: ["Open spaces · Sports grounds · Landscaped gardens"] },
      { icon: "medal", title: "Premium specification", lines: ["Private balcony or terrace to every home"] },
      { icon: "f_completion", title: "Ready to move in", lines: ["Early 2027"] },
    ],
  },

  "the-icon": {
    eyebrow: "READY TO MOVE INTO",
    items: [
      { icon: "pin", title: "The Icon is located at the award-winning Knights Park" },
      { icon: "park", title: "Exclusive resident amenities", lines: ["Rooftop garden · Concierge", "Landscaped courtyard"] },
      { icon: "f_parking", title: "Parking included", lines: ["Basement parking with every home"] },
      { icon: "sun", title: "Spacious, light-filled apartments", lines: ["Floor-to-ceiling triple glazing"] },
      { icon: "cat_food", title: "Market Square opposite", lines: ["Shops · Restaurants", "Bars · Sainsbury's"] },
      { icon: "cat_fitness", title: "Green surroundings", lines: ["Open spaces & sports facilities"] },
      { icon: "medal", title: "Premium specification", lines: ["Miele appliances to selected homes"] },
    ],
  },

  "knights-park": {
    items: [
      { icon: "pin", title: "1.9 miles from Cambridge city centre" },
      { icon: "crane", title: "Part of the University of Cambridge's Eddington development" },
      { icon: "towers", title: "Over £1bn invested", lines: ["Major new academic, commercial & residential district"] },
      { icon: "walk", title: "University life on your doorstep", lines: ["Colleges, institutions & campuses nearby"] },
      { icon: "leaf", title: "Pioneering sustainable living", lines: ["Sustainability at the heart of Eddington"] },
      { icon: "school", title: "Excellent education", lines: ["University of Cambridge Primary School on site"] },
      { icon: "park", title: "Established community", lines: ["Shops, amenities & green spaces close by"] },
      { icon: "trophy", title: "Knights Park awarded Gold", lines: ["for Best Sustainable Development at the WhatHouse? awards"] },
      { icon: "trophy", title: "Knights Park awarded Best Exterior Design", lines: ["at the WhatHouse? awards"] },
    ],
  },

  "marleigh-park": {
    items: [
      { icon: "f_homes", title: "Award-winning", lines: ["142-acre development", "1,391 homes"] },
      { icon: "f_types", title: "2–5 bed freehold houses", lines: ["Plus 2 bed apartments"] },
      { icon: "school", title: "Established community", lines: ["School · Nursery", "Shops · Dining"] },
      { icon: "car", title: "Cambridge", lines: ["City centre & station - 12 mins drive"] },
      { icon: "laptop", title: "Employment hubs", lines: ["Science Park & Business Park - 10 mins drive"] },
      { icon: "cat_fitness", title: "On-site leisure", lines: ["Padel courts opening 2027", "Football pitches · Allotments"] },
      { icon: "park", title: "Green surroundings", lines: ["Adjacent to Kingsley Wood"] },
      { icon: "rocket", title: "Phase 3 Launching", lines: ["2027"] },
    ],
  },

  "clifton-collection": {
    eyebrow: "UPCOMING IN BRISTOL",
    items: [
      { icon: "pin", title: "Prime Clifton location", lines: ["Historic conservation area", "Clifton Village nearby"] },
      { icon: "f_homes", title: "Exclusive collection of 49 homes", lines: ["42 apartments · 7 mews houses"] },
      { icon: "f_types", title: "Apartments & freehold houses", lines: ["1–3 bed apartments", "4 bed houses"] },
      { icon: "school", title: "Excellent education", lines: ["University of Bristol", "UWE Bristol · Clifton College"] },
      { icon: "medal", title: "Premium specification", lines: ["Siemens appliances", "Herringbone flooring to selected homes"] },
      { icon: "f_parking", title: "Parking available", lines: ["Included with houses", "Available with selected apartments"] },
      { icon: "diamond", title: "Prestigious neighbourhood", lines: ["Iconic architecture", "Established Bristol address"] },
      { icon: "f_completion", title: "Estimated completion", lines: ["Q1 2027"] },
    ],
  },

  wembley: {
    eyebrow: "UPCOMING IN LONDON",
    items: [
      { icon: "pin", title: "Iconic Wembley location", lines: ["Gateway to Olympic Way"] },
      { icon: "walk", title: "Wembley Park Station - 1 min walk", lines: ["Central London - 12 mins by train"] },
      { icon: "cat_food", title: "World-class lifestyle", lines: ["Boxpark", "London Designer Outlet", "Entertainment"] },
      { icon: "towers", title: "£2.5bn+ regeneration", lines: ["Major investment already delivered"] },
      { icon: "stadium", title: "Iconic Wembley Arch views", lines: ["From selected apartments"] },
      { icon: "f_tenure", title: "Strong rental demand", lines: ["Established rental market", "Young professionals & students"] },
      { icon: "medal", title: "Premium all-inclusive specification" },
      { icon: "train", title: "Fantastic Transport Links" },
      { icon: "f_completion", title: "Estimated Completion", lines: ["2029"] },
      { icon: "f_homes", title: "Number of new homes", lines: ["307 in total"] },
      { icon: "rocket", title: "Potential Launch", lines: ["Q3 2027"] },
    ],
  },

  "ham-richmond": {
    eyebrow: "UPCOMING IN LONDON",
    items: [
      { icon: "pin", title: "Prestigious Richmond Borough", lines: ["Established southwest London location"] },
      { icon: "river", title: "River Thames", lines: ["(at the end of the road)"] },
      { icon: "park", title: "Exceptional green surroundings", lines: ["Petersham Meadows", "Richmond Park · Ham House"] },
      { icon: "school", title: "Excellent education", lines: ["Highly regarded local schools"] },
      { icon: "diamond", title: "Rare new-build opportunity", lines: ["Limited new homes in Richmond"] },
      { icon: "f_types", title: "Apartments & freehold houses", lines: ["Studios to 3 beds · 4 & 5 bed houses"] },
      { icon: "park", title: "Landscaped new community", lines: ["Green spaces throughout"] },
      { icon: "f_homes", title: "Number of new homes", lines: ["452+ in total"] },
      { icon: "f_completion", title: "First release: Apartments", lines: ["Estimated completion from Q3/Q4 2028"] },
    ],
  },

  "ribbon-quarter": {
    eyebrow: "UPCOMING IN THE MIDLANDS",
    items: [
      { icon: "towers", title: "£450m city-centre regeneration", lines: ["Landmark 15.7-acre masterplan"] },
      { icon: "f_homes", title: "1,575 new homes", lines: ["New mixed-use neighbourhood"] },
      { icon: "cat_food", title: "City-centre lifestyle", lines: ["Shops · Restaurants · Leisure", "Public spaces"] },
      { icon: "walk", title: "Coventry Station - 8 mins walk" },
      { icon: "train", title: "Fast direct trains", lines: ["London Euston <1 hour", "Birmingham <30 mins"] },
      { icon: "laptop", title: "Major employment hub", lines: ["Jaguar Land Rover & global employers"] },
      { icon: "school", title: "Two leading universities", lines: ["Coventry University", "University of Warwick"] },
      { icon: "f_tenure", title: "Strong rental demand", lines: ["Professionals · Families", "International students"] },
      { icon: "f_completion", title: "Estimated Earliest Completion", lines: ["2029/2030"] },
      { icon: "rocket", title: "Potential Launch", lines: ["2027/2028"] },
    ],
  },

  "southville-collection": {
    eyebrow: "UPCOMING IN BRISTOL",
    items: [
      { icon: "f_homes", title: "74 private homes", lines: ["Apartments & freehold houses"] },
      { icon: "f_parking", title: "Parking with every house", lines: ["EV charging included"] },
      { icon: "walk", title: "North Street – 2 mins walk", lines: ["Shops · Restaurants · Bars"] },
      { icon: "bike", title: "Bristol city centre", lines: ["By cycle - 7 mins"] },
      { icon: "park", title: "Green surroundings", lines: ["1,182 acres across 13 parks"] },
      { icon: "school", title: "Two leading universities", lines: ["University of Bristol (8 mins cycle)", "UWE Bristol"] },
      { icon: "yield", title: "54% rental growth over 5 years" },
      { icon: "yield", title: "72% price growth over 10 years" },
      { icon: "f_completion", title: "Estimated completion", lines: ["Houses from Q1 2027", "Apartments from Q4 2027"] },
      { icon: "rocket", title: "Launching", lines: ["October 2026"] },
    ],
  },

  "baltic-wharf": {
    eyebrow: "UPCOMING IN BRISTOL",
    items: [
      { icon: "river", title: "Prime waterfront location", lines: ["Bristol's historic Floating Harbour"] },
      { icon: "anchor", title: "Bristol Marina on the doorstep", lines: ["Waterside lifestyle & activities"] },
      { icon: "towers", title: "Rare new-build opportunity", lines: ["1, 2 & 3 bed apartments"] },
      { icon: "bridge", title: "Exceptional views", lines: ["Harbour · Marina", "Clifton & Suspension Bridge*"] },
      { icon: "walk", title: "Walkable city-centre lifestyle", lines: ["Business districts &", "Harbourside nearby"] },
      { icon: "cat_food", title: "Wapping Wharf moments away", lines: ["Food · Drink · Culture"] },
      { icon: "leaf", title: "Sustainable living", lines: ["Air-source heat pumps ·", "Solar PV · Green roofs"] },
      { icon: "f_homes", title: "Number of new homes", lines: ["166"] },
      { icon: "rocket", title: "Potential launch", lines: ["Q2 2027"] },
    ],
  },
};
