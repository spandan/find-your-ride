"use client";

import { CONTACT_EMAIL } from "@/lib/constants";
import { AppLogo } from "./AppLogo";

export function AppFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <AppLogo />
        <p className="mt-2 text-xs text-slate-500">Helping parents connect safely.</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          <a href="/privacy" className="text-slate-600 hover:text-blue-700">
            Privacy Policy
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-slate-600 hover:text-blue-700"
          >
            Contact
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Report%20Listing`}
            className="text-slate-600 hover:text-blue-700"
          >
            Report Listing
          </a>
        </div>
      </div>
    </footer>
  );
}
