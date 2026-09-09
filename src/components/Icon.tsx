const paths: Record<string, React.ReactNode> = {
  heart: (
    <path d="M12 20.5s-7.6-4.6-10-9.3C.4 7.7 2 4 5.6 4c2 0 3.4 1 4.4 2.4C11 5 12.4 4 14.4 4 18 4 19.6 7.7 18 11.2c-2.4 4.7-10 9.3-10 9.3z" />
  ),
  "heart-fill": (
    <path
      d="M12 20.5s-7.6-4.6-10-9.3C.4 7.7 2 4 5.6 4c2 0 3.4 1 4.4 2.4C11 5 12.4 4 14.4 4 18 4 19.6 7.7 18 11.2c-2.4 4.7-10 9.3-10 9.3z"
      fill="currentColor"
    />
  ),
  compare: (
    <>
      <path d="M7 3v18M17 3v18" />
      <path d="M3 8l4-4 4 4M13 16l4 4 4-4" />
    </>
  ),
  menu: (
    <>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6L6 18" />
    </>
  ),
  minus: <path d="M6 12h12" />,
  message: <path d="M4 4h16v12H7l-3 3z" strokeLinejoin="round" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronLeft: <path d="M15 18l-6-6 6-6" />,
  chevronRight: <path d="M9 18l6-6-6-6" />,
  pin: (
    <>
      <path d="M12 22s7-7.4 7-12.5A7 7 0 0 0 5 9.5C5 14.6 12 22 12 22z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" />
      <path d="M3 18v2M21 18v2" />
      <path d="M3 12V7a1 1 0 0 1 1-1h6v4" />
      <path d="M13 10V6h5a2 2 0 0 1 2 2v2" />
    </>
  ),
  check: <path d="M5 13l4 4L19 7" />,
  phone: (
    <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2C10.5 19 5 13.5 5 6a2 2 0 0 1 1-3z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  star: (
    <path
      d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.1 6.6L12 17.6l-5.8 3 1.1-6.6L2.5 9.4l6.6-.9z"
      fill="currentColor"
    />
  ),
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" />,
  download: (
    <>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M4 19h16" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4L10 14" />
      <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  car: (
    <>
      <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13" />
      <rect x="3" y="13" width="18" height="5" rx="1.5" />
      <circle cx="7" cy="18.5" r="1.3" />
      <circle cx="17" cy="18.5" r="1.3" />
    </>
  ),
  park: (
    <>
      <path d="M12 3l4 6h-2.5l3.5 5H7l3.5-5H8z" />
      <path d="M12 14v7" />
    </>
  ),
  concierge: (
    <>
      <path d="M4 20a8 8 0 0 1 16 0" />
      <path d="M4 20h16" />
      <circle cx="12" cy="8" r="4" />
    </>
  ),
  train: (
    <>
      <rect x="5" y="4" width="14" height="13" rx="4" />
      <path d="M5 12h14" />
      <circle cx="9" cy="15" r="0" />
      <path d="M8 21l1.5-2M16 21l-1.5-2" />
      <circle cx="9" cy="14" r="1" />
      <circle cx="15" cy="14" r="1" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    </>
  ),
  arrowRight: <path d="M4 12h16M13 5l7 7-7 7" />,
  quote: (
    <path
      d="M9 7c-3 1.5-4 4-4 6.5A3.5 3.5 0 0 0 8.5 17 3 3 0 0 0 11 14 2.6 2.6 0 0 0 8.5 11.4c.2-1.6 1.2-3 3-4zm9 0c-3 1.5-4 4-4 6.5a3.5 3.5 0 0 0 3.5 3.5A3 3 0 0 0 20 14a2.6 2.6 0 0 0-2.5-2.6c.2-1.6 1.2-3 3-4z"
      fill="currentColor"
    />
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13C12 9.5 9.5 7 6 7c0 3.5 2.5 6 6 6Z" />
      <path d="M12 13c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6Z" />
    </>
  ),
  bolt: <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />,
  crane: (
    <>
      <path d="M2 18h20" />
      <path d="M4 18v-2a8 8 0 0 1 16 0v2" />
      <path d="M10 3h4v5" />
    </>
  ),
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />,
  landmark: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4L18 18M18 6l-1.6 1.6M7.6 16.4L6 18" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  towers: (
    <>
      <path d="M3 21h18" />
      <path d="M6 21V13l3-2 3 2v8" />
      <path d="M13 21V8l3-3 3 3v13" />
    </>
  ),
  gym: (
    <>
      <path d="M6 7v10M18 7v10" />
      <path d="M2 10v4M22 10v4" />
      <path d="M6 12h12" />
    </>
  ),
  nursery: (
    <>
      <circle cx="12" cy="12.5" r="7" />
      <path d="M9.3 9c.4-1.3 1.4-2 2.4-2" />
      <path d="M9.2 14.3c.8.7 1.8 1.1 2.8 1.1s2-.4 2.8-1.1" />
      <circle cx="12" cy="12.6" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  school: (
    <>
      <path d="M12 3.5 2.5 8 12 12.5 21.5 8 12 3.5z" />
      <path d="M6.5 10.2V15c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-4.8" />
      <path d="M21.5 8v5" />
    </>
  ),
  woodland: (
    <>
      <path d="M8 3.5 3.6 10h2.1L3 14.6h10L10.3 10h2.1L8 3.5z" />
      <path d="M8 14.6V20.5" />
      <path d="M17.5 7.5 14.6 12h1.5l-1.9 3.2h6.6L18.9 12h1.5L17.5 7.5z" />
      <path d="M17.5 15.2V20.5" />
    </>
  ),
  supermarket: (
    <>
      <path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.3a2 2 0 0 0 2-1.55L20.5 8H6.2" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </>
  ),
  terrace: (
    <>
      <rect x="3" y="3" width="18" height="8" rx="1.5" />
      <path d="M3 15h18M6 15v5M12 15v5M18 15v5" />
    </>
  ),
  yield: (
    <>
      <path d="M4 19h16" />
      <path d="M5 15l4.5-4.5 3.5 3L19 7" />
      <path d="M15 7h4v4" />
    </>
  ),
  stadium: (
    <>
      <ellipse cx="12" cy="17.2" rx="9" ry="3.3" />
      <path d="M4.6 15.6A8 8 0 0 1 19.4 15.6" />
      <path d="M4.6 15.6v1.6M19.4 15.6v1.6" />
    </>
  ),
  f_homes: (
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </>
  ),
  f_types: (
    <>
      <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" />
      <path d="M3 18v2M21 18v2" />
      <path d="M5 10V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" />
      <path d="M13 10V8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </>
  ),
  f_tenure: (
    <>
      <path d="M9 3h6l4 4v14H5V3z" />
      <path d="M9 11h6M9 15h4" />
    </>
  ),
  f_completion: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </>
  ),
  f_price: (
    <>
      <path d="M9 20V9a4 4 0 0 1 7.2-2.4" />
      <path d="M6 13h7" />
      <path d="M5 20h11" />
    </>
  ),
  f_travel: (
    <>
      <rect x="5" y="3" width="14" height="14" rx="2" />
      <path d="M5 9h14" />
      <path d="M8 21l1.5-4M16 21l-1.5-4" />
    </>
  ),
  f_epc: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </>
  ),
  f_parking: (
    <>
      <rect x="3" y="9" width="18" height="10" rx="2" />
      <path d="M7 19v2M17 19v2" />
      <path d="M7 14h4a2 2 0 1 0 0-4H7v7" />
    </>
  ),
  f_zone: (
    <>
      <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  f_warranty: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9.5 12l1.8 1.8L14.5 10" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.6-6.2 9.5-6.2S21.5 12 21.5 12s-3.6 6.2-9.5 6.2S2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  sg_kitchen: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M4 10h16" />
      <path d="M8 6.5h3" />
      <path d="M12 14v3" />
    </>
  ),
  sg_bathroom: (
    <>
      <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
      <path d="M7 12V6.5A2.5 2.5 0 0 1 12 6" />
      <path d="M6 19l-1 2M18 19l1 2" />
    </>
  ),
  sg_heating: (
    <>
      <path d="M8 4v6" />
      <path d="M12 4v6" />
      <path d="M16 4v6" />
      <path d="M4 15h16" />
      <path d="M4 19h16" />
    </>
  ),
  sg_electrical: <path d="M13 2 5 13h6l-1 9 8-11h-6z" />,
  sg_communal: (
    <>
      <path d="M3 21V8l6-4 6 4v13" />
      <path d="M15 21V11l6 3v7" />
      <path d="M8 21v-5h3v5" />
    </>
  ),
  sg_finishes: (
    <>
      <path d="M4 20h5l10-10a2.5 2.5 0 0 0-3.5-3.5L5 17z" />
      <path d="M13.5 6.5 17 10" />
    </>
  ),
  sg_additional: (
    <>
      <path d="M9 3h6l4 4v14H5V3z" />
      <path d="M9 11h6M9 15h4" />
    </>
  ),
  cat_transport: (
    <>
      <rect x="5" y="3" width="14" height="14" rx="2" />
      <path d="M5 9h14" />
      <path d="M8 21l1.5-4M16 21l-1.5-4" />
      <path d="M9 13h.01M15 13h.01" />
    </>
  ),
  cat_food: (
    <>
      <path d="M6 3v8a2.5 2.5 0 0 0 5 0V3" />
      <path d="M8.5 11v10" />
      <path d="M17 3c-1.5 2-2 3.5-2 5.5A2.5 2.5 0 0 0 17.5 11h.5" />
      <path d="M17 11v10" />
    </>
  ),
  cat_green: (
    <>
      <path d="M12 3c3 2.5 4.5 5.2 4.5 8a4.5 4.5 0 0 1-9 0c0-2.8 1.5-5.5 4.5-8z" />
      <path d="M12 15v6" />
    </>
  ),
  cat_fitness: (
    <>
      <path d="M4 9v6M20 9v6" />
      <path d="M7 6v12M17 6v12" />
      <path d="M7 12h10" />
    </>
  ),
  cat_shops: (
    <>
      <path d="M4 8h16l-1.4 12H5.4z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  cat_schools: (
    <>
      <path d="M3 9l9-4 9 4-9 4z" />
      <path d="M7 11.5V16c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4.5" />
    </>
  ),
};

export default function Icon({
  name,
  className = "",
  strokeWidth = 1.8,
  style,
}: {
  name: keyof typeof paths;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
