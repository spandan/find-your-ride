"use client";

import { useEffect, useState } from "react";
import type { ListingStatus, PreferredContactMethod, SharingIntent } from "@/generated/prisma/client";
import { getMyProfile, updateMyProfile } from "@/actions/auth";
import { CONTACT_METHODS } from "@/lib/constants";
import {
  looksLikeEmail,
  preferredMethodNeedsPhone,
  validateSignupContact,
} from "@/lib/contact-validation";
import { isInactiveStatus } from "@/lib/school";
import type { UserProfile } from "@/lib/types";
import { AppModal } from "./AppModal";

type ProfileModalProps = {
  onClose: () => void;
  onSaved: (message?: string) => void;
};

function gradesToString(grades: string[]): string {
  return grades.join(", ");
}

function parseGrades(raw: string): string[] {
  return raw
    .split(/[,;]+/)
    .map((g) => g.trim())
    .filter(Boolean);
}

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
  const [gradesText, setGradesText] = useState("");
  const [streetName, setStreetName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("TX");
  const [sharingIntent, setSharingIntent] = useState<SharingIntent>("BOTH");
  const [status, setStatus] = useState<ListingStatus>("ACTIVE");

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
      setGradesText(gradesToString(data.grades));
      setStreetName(data.streetName);
      setCity(data.city);
      setState(data.state);
      setSharingIntent(data.sharingIntent);
      setStatus(data.status);
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
  const inactive = isInactiveStatus(status);

  async function saveProfile(reactivate: boolean) {
    if (!profile) return;

    setError(null);
    const grades = parseGrades(gradesText);
    if (grades.length === 0) {
      setError("Please enter at least one grade.");
      return;
    }

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
      grades,
      streetName,
      city,
      state,
      sharingIntent,
      reactivate,
    });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onSaved(
      reactivate
        ? "Listing updated and activated — you're looking for a ride again."
        : "Profile updated."
    );
    onClose();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await saveProfile(false);
  }

  return (
    <AppModal onClose={onClose} labelledBy="profile-title">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 id="profile-title" className="text-lg font-bold text-slate-900">
            Edit profile & listing
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Update contact info, kids&apos; grades, and your map listing.
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

          {inactive && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-900">
              Your listing is inactive on the map. Update grades or other details,
              then save and activate when you&apos;re looking again.
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

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
            <p className="text-xs font-semibold text-slate-800">Listing on the map</p>
            <div className="mt-3 space-y-3">
              <label className="block">
                <span className="field-label">Kids&apos; grades (comma-separated) *</span>
                <input
                  required
                  placeholder="e.g. K, 3, 7"
                  className="input-field"
                  value={gradesText}
                  onChange={(e) => setGradesText(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="field-label">Home street name *</span>
                <input
                  required
                  placeholder="e.g. Main St"
                  className="input-field"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="field-label">City *</span>
                  <input
                    required
                    className="input-field"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="field-label">State *</span>
                  <input
                    required
                    maxLength={2}
                    className="input-field uppercase"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                  />
                </label>
              </div>
              <label className="block">
                <span className="field-label">Looking for *</span>
                <select
                  required
                  className="select-field"
                  value={sharingIntent}
                  onChange={(e) =>
                    setSharingIntent(e.target.value as SharingIntent)
                  }
                >
                  <option value="PICKUP">Pickup</option>
                  <option value="DROPOFF">Drop-off</option>
                  <option value="BOTH">Pickup & drop-off</option>
                </select>
              </label>
            </div>
          </div>

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

          <div className="flex flex-col gap-2">
            {inactive ? (
              <>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => saveProfile(true)}
                  className="btn-primary w-full"
                >
                  {submitting ? "Saving…" : "Save & activate listing"}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-secondary w-full"
                >
                  Save without activating
                </button>
              </>
            ) : (
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? "Saving…" : "Save changes"}
              </button>
            )}
          </div>
        </form>
      )}

      {!loading && !profile && error && (
        <p className="text-sm text-rose-700">{error}</p>
      )}
    </AppModal>
  );
}
