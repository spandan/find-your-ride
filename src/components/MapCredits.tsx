"use client";

const CREDITS = [
  {
    label: "© OpenStreetMap",
    href: "https://www.openstreetmap.org/copyright",
  },
  {
    label: "OpenFreeMap",
    href: "https://openfreemap.org/",
  },
  {
    label: "MapLibre",
    href: "https://maplibre.org/",
  },
] as const;

export function MapCredits() {
  return (
    <div
      className="map-credits pointer-events-none absolute bottom-2 left-1/2 z-[5] max-w-[min(100%,20rem)] -translate-x-1/2 px-2 sm:max-w-none"
      aria-label="Map data attribution"
    >
      <p className="rounded-lg border border-slate-200/80 bg-white/90 px-2.5 py-1 text-center text-[10px] leading-relaxed text-slate-600 shadow-sm backdrop-blur-sm">
        {CREDITS.map((credit, index) => (
          <span key={credit.href}>
            {index > 0 && <span className="text-slate-400"> · </span>}
            <a
              href={credit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto font-medium text-slate-700 underline-offset-2 hover:text-blue-800 hover:underline"
            >
              {credit.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
