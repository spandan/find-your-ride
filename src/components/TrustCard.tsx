const TRUST_POINTS = [
  "Child names are never displayed.",
  "Exact addresses are optional.",
  "You choose what information to share.",
  "You control your listing.",
  "Listings can be paused or removed at any time.",
];

export function TrustCard() {
  return (
    <div className="card p-4">
      <h3 className="section-heading">Trust &amp; Privacy</h3>
      <ul className="mt-3 space-y-2">
        {TRUST_POINTS.map((point) => (
          <li key={point} className="flex gap-2 text-xs leading-relaxed text-slate-600">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
