import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — Find Your Ride",
  description: "Privacy Policy for the Find Your Ride community platform.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p className="text-slate-500">Last updated: June 30, 2026</p>

      <p className="mt-4">
        Find Your Ride respects your privacy. This policy describes what information
        we collect and how we use it when you use our community map.
      </p>

      <h2 className="mt-8 text-base font-semibold text-slate-900">Information we collect</h2>
      <p className="mt-2">
        When you create an account, we store the information you provide, such as
        your display name, contact preferences, school, grades, approximate location,
        and account credentials (passcodes are stored as one-way salted hashes).
      </p>

      <h2 className="mt-8 text-base font-semibold text-slate-900">How we use information</h2>
      <p className="mt-2">
        We use your information to show your listing on the school map, help other
        families find nearby partners, and support account recovery. Contact details
        are shared with other logged-in families only when you opt in and accept the
        user agreement.
      </p>

      <h2 className="mt-8 text-base font-semibold text-slate-900">What we recommend sharing</h2>
      <p className="mt-2">
        Only share the contact method you are comfortable providing, such as phone
        or email. Do not share sensitive personal information such as your full home
        address, financial information, passwords, or other private details through
        this platform.
      </p>

      <h2 className="mt-8 text-base font-semibold text-slate-900">Third-party services</h2>
      <p className="mt-2">
        The map uses open map data and geocoding services. See{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">THIRD_PARTY_NOTICES.md</code>{" "}
        in the project repository for attribution and license details.
      </p>

      <h2 className="mt-8 text-base font-semibold text-slate-900">Data retention</h2>
      <p className="mt-2">
        Listings may be deactivated or soft-deleted. You can request removal by
        deactivating your listing or contacting the platform operator.
      </p>

      <h2 className="mt-8 text-base font-semibold text-slate-900">Agreement records</h2>
      <p className="mt-2">
        When you accept the user agreement, we record the agreement version, timestamp,
        and may store a client IP address for audit purposes.
      </p>

      <p className="mt-8 text-slate-500">
        This is a placeholder document. Consult legal counsel before relying on it
        for production use.
      </p>
    </LegalPageLayout>
  );
}
