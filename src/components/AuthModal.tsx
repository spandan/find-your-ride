"use client";

import { useEffect, useState } from "react";
import type { PreferredContactMethod } from "@/generated/prisma/client";
import {
  login,
  logout,
  resetPasscode,
  signup,
} from "@/actions/auth";
import { CONTACT_METHODS, RESET_IDENTITY_MISMATCH_MESSAGE, SAFETY_DISCLAIMER } from "@/lib/constants";
import {
  looksLikeEmail,
  preferredMethodNeedsPhone,
  validateSignupContact,
} from "@/lib/contact-validation";
import { DEFAULT_SCHOOL_ID, DEFAULT_SCHOOL_NAME, hasMultipleSchools, type SchoolOption } from "@/lib/schools";
import type { SessionUser } from "@/lib/types";
import { PasscodeInput } from "./PasscodeInput";

type AuthMode = "login" | "signup" | "reset";

type AuthModalProps = {
  mode: AuthMode;
  schools: SchoolOption[];
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onSuccess: (coords?: { lat: number; lng: number; listingId?: string }) => void;
};

export function AuthModal({
  mode,
  schools,
  onClose,
  onModeChange,
  onSuccess,
}: AuthModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signupLoginId, setSignupLoginId] = useState("");
  const [signupContactEmail, setSignupContactEmail] = useState("");
  const [signupContactPhone, setSignupContactPhone] = useState("");
  const [signupPreferredMethod, setSignupPreferredMethod] =
    useState<PreferredContactMethod>("EMAIL");
  const [signupSchoolId, setSignupSchoolId] = useState<string>(DEFAULT_SCHOOL_ID);
  const [contactEmailEdited, setContactEmailEdited] = useState(false);

  useEffect(() => {
    if (mode === "signup") {
      setSignupLoginId("");
      setSignupContactEmail("");
      setSignupContactPhone("");
      setSignupPreferredMethod("EMAIL");
      setSignupSchoolId(schools[0]?.id ?? DEFAULT_SCHOOL_ID);
      setContactEmailEdited(false);
      setError(null);
    }
  }, [mode, schools]);

  function handleSignupLoginIdChange(value: string) {
    setSignupLoginId(value);
    if (looksLikeEmail(value) && !contactEmailEdited) {
      setSignupContactEmail(value.trim().toLowerCase());
    }
  }

  const signupEmailRequired =
    signupPreferredMethod === "EMAIL" || !looksLikeEmail(signupLoginId);
  const signupPhoneRequired = preferredMethodNeedsPhone(signupPreferredMethod);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const result = await login({
      loginId: form.get("loginId") as string,
      passcode: form.get("passcode") as string,
    });
    setSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onSuccess({ lat: result.lat, lng: result.lng });
    onClose();
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const gradesRaw = (form.get("grades") as string) || "";
    const grades = gradesRaw
      .split(/[,;]+/)
      .map((g) => g.trim())
      .filter(Boolean);

    const contactError = validateSignupContact(
      signupPreferredMethod,
      signupContactEmail,
      signupContactPhone,
      signupLoginId
    );
    if (contactError) {
      setError(contactError);
      return;
    }

    setSubmitting(true);
    const result = await signup({
      firstName: form.get("firstName") as string,
      lastName: form.get("lastName") as string,
      contactEmail: signupContactEmail,
      contactPhone: signupContactPhone || undefined,
      preferredContactMethod: signupPreferredMethod,
      grades,
      schoolId: signupSchoolId,
      streetName: form.get("streetName") as string,
      city: form.get("city") as string,
      state: form.get("state") as string,
      sharingIntent: (form.get("sharingIntent") as "PICKUP" | "DROPOFF" | "BOTH") || "BOTH",
      showPersonalInfo: form.get("showPersonalInfo") === "on",
      showContactInfo: form.get("showContactInfo") === "on",
      loginId: signupLoginId,
      passcode: form.get("passcode") as string,
      consentGiven: form.get("consentGiven") === "on",
    });
    setSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onSuccess({
      lat: result.lat,
      lng: result.lng,
      listingId: result.listingId,
    });
    onClose();
  }

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const firstName = (form.get("firstName") as string).trim();
    const lastName = (form.get("lastName") as string).trim();
    const loginId = (form.get("loginId") as string).trim();
    const newPasscode = form.get("newPasscode") as string;

    if (!firstName || !lastName || !loginId) {
      setError(RESET_IDENTITY_MISMATCH_MESSAGE);
      return;
    }

    setSubmitting(true);
    const result = await resetPasscode({
      firstName,
      lastName,
      loginId,
      newPasscode,
    });
    setSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onSuccess();
    onClose();
  }

  const titles: Record<AuthMode, string> = {
    login: "Log in",
    signup: "Sign up",
    reset: "Reset passcode",
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="panel max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-2xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-xl sm:max-h-[90vh] sm:rounded-xl sm:p-6 sm:pb-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 id="auth-title" className="text-lg font-bold text-slate-900">
              {titles[mode]}
            </h2>
            {mode === "signup" && (
              <p className="mt-1 text-xs text-slate-500">
                Your name is used only to reset your passcode — never shown on
                the map.
              </p>
            )}
            {mode === "reset" && (
              <p className="mt-1 text-xs text-slate-500">
                Enter the first and last name you used when signing up.
              </p>
            )}
          </div>
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

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="field-label">Username or email</span>
              <input name="loginId" required className="input-field" autoComplete="username" />
            </label>
            <PasscodeInput
              name="passcode"
              label="Passcode"
              autoComplete="current-password"
            />
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Logging in…" : "Log in"}
            </button>
            <div className="space-y-2 pt-1 text-center text-xs text-slate-500">
              <p>
                <button
                  type="button"
                  onClick={() => onModeChange("reset")}
                  className="font-medium text-blue-800 hover:text-blue-900"
                >
                  Forgot passcode?
                </button>
              </p>
              <p>
                No account?{" "}
                <button
                  type="button"
                  onClick={() => onModeChange("signup")}
                  className="font-medium text-blue-800 hover:text-blue-900"
                >
                  Add My Family
                </button>
              </p>
            </div>
          </form>
        )}

        {mode === "reset" && (
          <form onSubmit={handleReset} className="space-y-4">
            <label className="block">
              <span className="field-label">First name</span>
              <input name="firstName" required className="input-field" />
            </label>
            <label className="block">
              <span className="field-label">Last name</span>
              <input name="lastName" required className="input-field" />
            </label>
            <label className="block">
              <span className="field-label">Username or email</span>
              <input name="loginId" required className="input-field" />
            </label>
            <PasscodeInput
              name="newPasscode"
              label="New passcode"
              autoComplete="new-password"
            />
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Resetting…" : "Reset passcode"}
            </button>
            <button
              type="button"
              onClick={() => onModeChange("login")}
              className="btn-secondary w-full text-xs"
            >
              Back to log in
            </button>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">First name *</span>
                <input name="firstName" required className="input-field" />
              </label>
              <label className="block">
                <span className="field-label">Last name *</span>
                <input name="lastName" required className="input-field" />
              </label>
            </div>
            <label className="block">
              <span className="field-label">Username or email (for login) *</span>
              <input
                name="loginId"
                required
                className="input-field"
                autoComplete="username"
                value={signupLoginId}
                onChange={(e) => handleSignupLoginIdChange(e.target.value)}
              />
              {looksLikeEmail(signupLoginId) && !contactEmailEdited && (
                <span className="mt-1 block text-[10px] text-slate-400">
                  Using this email as your contact email
                </span>
              )}
            </label>
            <label className="block">
              <span className="field-label">
                Contact email{signupEmailRequired ? " *" : ""}
              </span>
              <input
                name="contactEmail"
                type="email"
                required={signupEmailRequired}
                className="input-field"
                autoComplete="email"
                value={signupContactEmail}
                onChange={(e) => {
                  setContactEmailEdited(true);
                  setSignupContactEmail(e.target.value);
                }}
                placeholder={
                  looksLikeEmail(signupLoginId)
                    ? "Defaults to your login email"
                    : undefined
                }
              />
            </label>
            <label className="block">
              <span className="field-label">
                Contact phone{signupPhoneRequired ? " *" : ""}
              </span>
              <input
                name="contactPhone"
                type="tel"
                required={signupPhoneRequired}
                className="input-field"
                autoComplete="tel"
                value={signupContactPhone}
                onChange={(e) => setSignupContactPhone(e.target.value)}
                placeholder="10-digit US number"
              />
            </label>
            <label className="block">
              <span className="field-label">Preferred contact method *</span>
              <select
                name="preferredContactMethod"
                required
                className="select-field"
                value={signupPreferredMethod}
                onChange={(e) =>
                  setSignupPreferredMethod(
                    e.target.value as PreferredContactMethod
                  )
                }
              >
                {CONTACT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="field-label">Kids&apos; grades (comma-separated) *</span>
              <input name="grades" required placeholder="e.g. K, 3, 7" className="input-field" />
            </label>
            <label className="block">
              <span className="field-label">School *</span>
              {hasMultipleSchools(schools) ? (
                <select
                  name="schoolId"
                  required
                  className="select-field"
                  value={signupSchoolId}
                  onChange={(e) => setSignupSchoolId(e.target.value)}
                >
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input type="hidden" name="schoolId" value={signupSchoolId} />
                  <p className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700">
                    {schools[0]?.name ?? DEFAULT_SCHOOL_NAME}
                  </p>
                </>
              )}
            </label>
            <label className="block">
              <span className="field-label">Home street name *</span>
              <input name="streetName" required placeholder="e.g. Main St" className="input-field" />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">City *</span>
                <input name="city" required defaultValue="Frisco" placeholder="Frisco" className="input-field" />
              </label>
              <label className="block">
                <span className="field-label">State *</span>
                <input name="state" required defaultValue="TX" maxLength={2} placeholder="TX" className="input-field uppercase" />
              </label>
            </div>
            <label className="block">
              <span className="field-label">Looking for *</span>
              <select name="sharingIntent" required defaultValue="BOTH" className="select-field">
                <option value="PICKUP">Pickup sharing</option>
                <option value="DROPOFF">Drop-off sharing</option>
                <option value="BOTH">Both pickup and drop-off</option>
              </select>
            </label>
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-700">Privacy on the map</p>
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input name="showPersonalInfo" type="checkbox" defaultChecked className="rounded" />
                Show personal information (display name)
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input name="showContactInfo" type="checkbox" defaultChecked className="rounded" />
                Show contact information
              </label>
            </div>
            <PasscodeInput
              name="passcode"
              label="Passcode *"
              autoComplete="new-password"
            />
            <p className="text-[10px] leading-relaxed text-slate-400">
              Your passcode is stored as a one-way salted hash — we never save
              or display the plain text.
            </p>
            <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <input name="consentGiven" type="checkbox" required className="mt-0.5 rounded" />
              <span className="text-xs leading-relaxed text-slate-600">{SAFETY_DISCLAIMER}</span>
            </label>
            <button type="submit" disabled={submitting} className="btn-success w-full">
              {submitting ? "Creating account…" : "Sign up & appear on map"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

type AuthButtonsProps = {
  user: SessionUser | null;
  onLogin: () => void;
  onSignup?: () => void;
  onUserChange: () => void;
};

export function AuthButtons({
  user,
  onLogin,
  onSignup,
  onUserChange,
}: AuthButtonsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    onUserChange();
  }

  async function handleFoundRide() {
    setActing(true);
    const { markFoundMyRide } = await import("@/actions/auth");
    const result = await markFoundMyRide();
    setActing(false);
    if (!result.success) {
      setMessage(result.error);
      return;
    }
    setMessage("Marked as found ride. Your marker is now muted.");
    setMenuOpen(false);
    onUserChange();
  }

  async function handleDeactivate() {
    setActing(true);
    const { deactivateMyListing } = await import("@/actions/auth");
    const result = await deactivateMyListing();
    setActing(false);
    if (!result.success) {
      setMessage(result.error);
      return;
    }
    setMessage("Listing deactivated. Your marker is now muted.");
    setMenuOpen(false);
    onUserChange();
  }

  if (!user) {
    return (
      <div className="flex h-11 items-center gap-2">
        <button type="button" onClick={onLogin} className="btn-secondary h-11 px-3 py-2 text-xs">
          Log in
        </button>
        <button type="button" onClick={() => onSignup?.()} className="btn-primary h-11 px-3 py-2 text-xs">
          Sign up
        </button>
      </div>
    );
  }

  const inactive = user.status !== "ACTIVE";

  const statusLabel =
    user.status === "ACTIVE"
      ? "Active"
      : user.status === "FOUND_RIDE"
        ? "Found ride"
        : "Inactive";

  const statusBadgeClass =
    user.status === "ACTIVE"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15"
      : user.status === "FOUND_RIDE"
        ? "bg-amber-50 text-amber-800 ring-amber-600/15"
        : "bg-slate-100 text-slate-600 ring-slate-500/10";

  return (
    <div className="relative">
      {message && (
        <div className="fixed inset-x-4 top-20 z-30 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 shadow-lg sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-64">
          {message}
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="ml-2 font-medium underline"
          >
            OK
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className={`profile-trigger ${menuOpen ? "profile-trigger--open" : ""}`}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
      >
        <span className="profile-avatar h-7 w-7">
          {user.firstName.charAt(0).toUpperCase()}
        </span>
        <span className="hidden truncate sm:inline">{user.firstName}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div
            role="menu"
            className="profile-menu absolute right-0 top-full z-30 mt-2 w-[min(calc(100vw-2rem),17rem)] sm:w-64"
          >
            <div className="profile-menu__header px-4 py-3.5">
              <div className="flex items-start gap-3">
                <span className="profile-avatar h-10 w-10 text-sm">
                  {user.firstName.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    Hi, {user.firstName}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-500">
                    {user.schoolName}
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${statusBadgeClass}`}
                  >
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-1.5">
              {!inactive && (
                <>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={acting}
                    onClick={handleFoundRide}
                    className="profile-menu__item"
                  >
                    <svg className="profile-menu__icon h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Mark as Found My Ride
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={acting}
                    onClick={handleDeactivate}
                    className="profile-menu__item"
                  >
                    <svg className="profile-menu__icon h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Deactivate my listing
                  </button>
                </>
              )}
              {inactive && (
                <p className="px-3 py-2.5 text-xs leading-relaxed text-slate-500">
                  Your listing is inactive on the map.
                </p>
              )}
            </div>

            <div className="border-t border-slate-200 p-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="profile-menu__item font-medium text-slate-600"
              >
                <svg className="profile-menu__icon h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
