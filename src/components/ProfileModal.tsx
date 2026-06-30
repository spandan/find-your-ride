"use client";

import { useEffect, useState } from "react";
import type { PreferredContactMethod } from "@/generated/prisma/client";
import { getMyProfile, updateMyProfile } from "@/actions/auth";
import { CONTACT_METHODS } from "@/lib/constants";
import {
  looksLikeEmail,
  preferredMethodNeedsPhone,
  validateSignupContact,
} from "@/lib/contact-validation";
import type { UserProfile } from "@/lib/types";
import { AppModal } from "./AppModal";

type ProfileModalProps = {
  onClose: () => void;
  onSaved: () => void;
};

export function ProfileModal({ onClose, onSaved }: ProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [preferredMethod, setPreferredMethod] =
    useState<PreferredContactMethod>("EMAIL");
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [showContactInfo, setShowContactInfo] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getMyProfile();
      if (cancelled) return;
      if (!data) {
        setError("Could not load your profile. Please log in again.");
        setLoading(false);
        return;
      }
      setProfile(data);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setContactEmail(data.contactEmail);
      setContactPhone(data.contactPhone ?? "");
      setPreferredMethod(data.preferredContactMethod);
      setShowPersonalInfo(data.showPersonalInfo);
      setShowContactInfo(data.showContactInfo);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const emailRequired =
    preferredMethod === "EMAIL" ||
    (profile ? !looksLikeEmail(profile.username) : false);
  const phoneRequired = preferredMethodNeedsPhone(preferredMethod);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;

    setError(null);
    const contactError = validateSignupContact(
      preferredMethod,
      contactEmail,
      contactPhone,
      profile.username
    );
    if (contactError) {
      setError(contactError);
      return;
    }

    setSubmitting(true);
    const result = await updateMyProfile({
      firstName,
      lastName,
      contactEmail,
      contactPhone: contactPhone || undefined,
      preferredContactMethod: preferredMethod,
      showPersonalInfo,
      showContactInfo,
    });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <AppModal onClose={onClose} labelledBy="profile-title">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 id="profile-title" className="text-lg font-bold text-slate-900">
              Edit profile
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Update your name and how other families can reach you.
            </p>
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

        {loading && (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-800" />
          </div>
        )}

        {!loading && profile && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">First name *</span>
                <input
                  required
                  className="input-field"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="field-label">Last name *</span>
                <input
                  required
                  className="input-field"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>

            <label className="block">
              <span className="field-label">Login username or email</span>
              <input
                readOnly
                className="input-field bg-slate-50 text-slate-500"
                value={profile.username}
              />
            </label>

            <label className="block">
              <span className="field-label">
                Contact email{emailRequired ? " *" : ""}
              </span>
              <input
                type="email"
                required={emailRequired}
                className="input-field"
                autoComplete="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="field-label">
                Contact phone{phoneRequired ? " *" : ""}
              </span>
              <input
                type="text"
                inputMode="tel"
                required={phoneRequired}
                className="input-field"
                autoComplete="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="10-digit US number"
              />
            </label>

            <label className="block">
              <span className="field-label">Preferred contact method *</span>
              <select
                required
                className="select-field"
                value={preferredMethod}
                onChange={(e) =>
                  setPreferredMethod(e.target.value as PreferredContactMethod)
                }
              >
                {CONTACT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-700">Privacy on the map</p>
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={showPersonalInfo}
                  onChange={(e) => setShowPersonalInfo(e.target.checked)}
                  className="rounded"
                />
                Show personal information (display name)
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={showContactInfo}
                  onChange={(e) => setShowContactInfo(e.target.checked)}
                  className="rounded"
                />
                Show contact information
              </label>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Saving…" : "Save changes"}
            </button>
          </form>
        )}

        {!loading && !profile && error && (
          <p className="text-sm text-rose-700">{error}</p>
        )}
    </AppModal>
  );
}
