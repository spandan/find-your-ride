import { AppModal } from "./AppModal";

const STEPS = [
  "Add your approximate location.",
  "Find nearby parents.",
  "Reach out using your preferred communication method.",
  'Mark "Found My Ride" once you have matched.',
];

type HowItWorksModalProps = {
  onClose: () => void;
};

export function HowItWorksModal({ onClose }: HowItWorksModalProps) {
  return (
    <AppModal onClose={onClose} labelledBy="how-it-works-title">
      <div className="flex items-start justify-between gap-3">
        <h2 id="how-it-works-title" className="text-lg font-bold text-slate-900">
          How It Works
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <ol className="mt-5 space-y-4">
        {STEPS.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-800">
              {index + 1}
            </span>
            <span className="pt-1 text-sm leading-relaxed text-slate-600">{step}</span>
          </li>
        ))}
      </ol>

      <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">
        Got it
      </button>
    </AppModal>
  );
}
