import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageLayoutProps = {
  title: string;
  children: ReactNode;
};

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <div className="h-dvh overflow-y-auto bg-[#F8FAFC]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm font-semibold text-blue-800 hover:text-blue-900">
            ← Back to Find Your Ride
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <div className="prose prose-slate mt-6 max-w-none text-sm leading-relaxed text-slate-600">
          {children}
        </div>
      </main>
    </div>
  );
}
