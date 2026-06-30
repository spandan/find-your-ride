"use client";

import type { SessionUser } from "@/lib/types";
import { AppLogo } from "./AppLogo";
import { AuthButtons } from "./AuthModal";

type TopNavProps = {
  user: SessionUser | null;
  onHowItWorks: () => void;
  onSignup: () => void;
  onLogin: () => void;
  onUserChange: () => void;
};

export function TopNav({
  user,
  onHowItWorks,
  onSignup,
  onLogin,
  onUserChange,
}: TopNavProps) {
  return (
    <header className="app-header z-30 flex h-16 shrink-0 items-center justify-between gap-3 px-4 lg:px-5">
      <div className="flex min-w-0 items-center">
        <AppLogo />
      </div>

      <nav className="flex min-w-0 shrink items-center gap-1.5 sm:gap-2 md:gap-3">
        <button
          type="button"
          onClick={onHowItWorks}
          className="btn-ghost hidden shrink-0 text-sm md:inline-flex"
        >
          How It Works
        </button>

        {user ? (
          <AuthButtons user={user} onLogin={onLogin} onUserChange={onUserChange} />
        ) : (
          <>
            <button
              type="button"
              onClick={onSignup}
              className="btn-ghost btn-nav-compact shrink-0 max-sm:px-2"
            >
              <span className="hidden sm:inline">Add My Family</span>
              <span className="sm:hidden">Add</span>
            </button>
            <button
              type="button"
              onClick={onLogin}
              className="btn-ghost btn-nav-compact shrink-0"
            >
              Login
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
