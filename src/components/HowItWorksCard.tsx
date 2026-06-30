const STEPS = [
  "Add your approximate location.",
  "Find nearby parents.",
  "Reach out using your preferred communication method.",
  'Mark "Found My Ride" once you have matched.',
];

type HowItWorksCardProps = {
  defaultOpen?: boolean;
};

export function HowItWorksCard({ defaultOpen = false }: HowItWorksCardProps) {
  return (
    <details className="card group" open={defaultOpen} id="how-it-works">
      <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
        How It Works
        <svg
          className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <ol className="space-y-3 border-t border-slate-100 px-4 pb-4 pt-3">
        {STEPS.map((step, index) => (
          <li key={step} className="flex gap-3 text-sm text-slate-600">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
              {index + 1}
            </span>
            <span className="pt-0.5 leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </details>
  );
}
