"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AGREEMENT_CHECKBOXES,
  AGREEMENT_INTRO,
  AGREEMENT_PRIVACY_REMINDER,
  AGREEMENT_TITLE,
  type AgreementCheckboxId,
} from "@/lib/agreement";

type AgreementContentProps = {
  acceptLabel?: string;
  submitting?: boolean;
  showCancel?: boolean;
  showLogout?: boolean;
  onAccept: () => void;
  onCancel?: () => void;
  onLogout?: () => void;
};

export function AgreementContent({
  acceptLabel = "Agree & Continue",
  submitting = false,
  showCancel = true,
  showLogout = false,
  onAccept,
  onCancel,
  onLogout,
}: AgreementContentProps) {
  const [checked, setChecked] = useState<Record<AgreementCheckboxId, boolean>>({
    connect: false,
    privacy: false,
    verify: false,
    terms: false,
  });

  const allChecked = useMemo(
    () => AGREEMENT_CHECKBOXES.every((item) => checked[item.id]),
    [checked]
  );

  function toggle(id: AgreementCheckboxId) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <>
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 id="agreement-title" className="text-lg font-bold text-slate-900">
          {AGREEMENT_TITLE}
        </h2>
        {showCancel && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-sm leading-relaxed text-slate-600">{AGREEMENT_INTRO}</p>

      <div className="mt-4 space-y-2.5">
        {AGREEMENT_CHECKBOXES.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300"
          >
            <input
              type="checkbox"
              checked={checked[item.id]}
              onChange={() => toggle(item.id)}
              className="mt-0.5 rounded border-slate-300 text-blue-800 focus:ring-blue-800"
            />
            <span className="text-xs leading-relaxed text-slate-700">
              {item.id === "terms" ? (
                <>
                  I have read and agree to the{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="font-medium text-blue-800 underline-offset-2 hover:underline"
                  >
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="font-medium text-blue-800 underline-offset-2 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </>
              ) : (
                item.label
              )}
            </span>
          </label>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/80 p-3.5">
        <p className="text-xs font-medium text-blue-900">Privacy reminder</p>
        <p className="mt-1 text-xs leading-relaxed text-blue-800/90">
          {AGREEMENT_PRIVACY_REMINDER}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
        <button
          type="button"
          disabled={!allChecked || submitting}
          onClick={onAccept}
          className="btn-primary w-full sm:flex-1"
        >
          {submitting ? "Saving…" : acceptLabel}
        </button>
        {showCancel && onCancel && (
          <button
            type="button"
            disabled={submitting}
            onClick={onCancel}
            className="btn-secondary w-full sm:flex-1"
          >
            Cancel
          </button>
        )}
        {showLogout && onLogout && (
          <button
            type="button"
            disabled={submitting}
            onClick={onLogout}
            className="btn-secondary w-full sm:flex-1"
          >
            Log out
          </button>
        )}
      </div>
    </>
  );
}
