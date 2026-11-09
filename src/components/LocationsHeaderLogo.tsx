"use client";

// A plain <img> can't reset this page's own state (selected/hovered pin,
// map pan/zoom, the open external-dev shell) - a full reload is the
// simplest way to guarantee every piece of it goes back to its initial
// state, rather than trying to track and clear each one individually.
export default function LocationsHeaderLogo() {
  return (
    <button type="button" onClick={() => window.location.reload()} aria-label="Reset map">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/uploads/hill-logo-transparent.png" alt="Hill International" className="h-[36.4px] w-auto" />
    </button>
  );
}
