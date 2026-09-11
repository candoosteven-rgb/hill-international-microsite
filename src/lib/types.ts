export type LangCode = "en" | "tr" | "zh" | "ar";

export interface Lang {
  code: LangCode;
  native: string;
  dir: "ltr" | "rtl";
  flag: string;
}

export interface AccessPoint {
  label: string;
  icon: string;
}

export type DevStatus = "live" | "coming-soon";

export interface Development {
  id: string;
  name: string;
  region: string;
  zone?: number;
  status: DevStatus;
  epc?: string;
  docs: { brochure: boolean; factsheet: boolean; investor: boolean };
  image?: string;
  logo?: string;
  locationLabel?: string;
  tagline?: string;
  showBedIcon?: boolean;
  images?: string[];
  accessNote?: string;
  place?: string;
  accessPoints?: AccessPoint[];
  hasMap?: boolean;
}

export interface GalleryItem {
  src: string;
  cap: string;
}

export interface Fact {
  k: string;
  v: string;
}

export interface SpecGroup {
  k: string;
  img: string;
  items: string[];
  note?: string;
}

export interface Plot {
  plot: string;
  building?: string;
  floor?: string;
  beds: number;
  baths?: number;
  size?: number;
  price?: number;
  avail: boolean;
}

export interface AmenityItem {
  name: string;
  d: string;
}

export interface TravelItem {
  to: string;
  n: string;
  mode: string;
}

export interface MarketingSuite {
  line1: string;
  line2: string;
  line3: string;
  phone: string;
  email: string;
  maps: string;
}

export interface PageData {
  auto?: boolean;
  hero: string;
  gallery: GalleryItem[];
  facts: Fact[];
  spec: SpecGroup[];
  travel: TravelItem[];
  hours: [string, string][];
  amenities: Record<string, AmenityItem[]>;
  suite: MarketingSuite | null;
  plots: Plot[];
  nearby: string[];
}

export interface TeamMember {
  id: string;
  photo: string;
  name: string;
  dept: string;
  role: string;
}
