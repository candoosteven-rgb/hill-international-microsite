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
      <path d="M3 21v-3M21 21v-3M3 13V7a1 1 0 0 1 1-1h6v6" />
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
    <path d="M5 19c9 0 14-5 14-14C10 5 5 10 5 19z" />
  ),
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />,
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
