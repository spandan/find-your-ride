import { SAFETY_DISCLAIMER } from "@/lib/constants";

export function Disclaimer() {
  return (
    <div className="panel border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50/50 p-4">
      <div className="flex gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
          aria-hidden
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-amber-900">Safety reminder</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800/90">
            {SAFETY_DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  );
}
