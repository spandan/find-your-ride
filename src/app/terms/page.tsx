import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms of Use — Find Your Ride",
  description: "Terms of Use for the Find Your Ride community platform.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Use">
      <p className="text-slate-500">Last updated: June 30, 2026</p>

      <p className="mt-4">
        Find Your Ride is a free community platform built by parents to help school
        families connect for transportation. By creating an account or using this
        service, you agree to these Terms of Use.
      </p>

      <h2 className="mt-8 text-base font-semibold text-slate-900">Community tool only</h2>
      <p className="mt-2">
        Find Your Ride only provides a way for families to discover one another.
        Any communication, ride arrangements, or agreements are solely between the
        participating individuals. We do not provide transportation services,
        vetting, insurance, or guarantees of any kind.
      </p>

      <h2 className="mt-8 text-base font-semibold text-slate-900">Your responsibilities</h2>
      <p className="mt-2">
        You are responsible for verifying the identity and suitability of anyone
        you choose to communicate with or arrange transportation through. You agree
        to use the platform respectfully and in compliance with applicable laws.
      </p>

      <h2 className="mt-8 text-base font-semibold text-slate-900">Account information</h2>
      <p className="mt-2">
        You agree to provide accurate information where required and to keep your
        passcode secure. You may use a nickname or alias for your first and last
        name if you can remember it for passcode recovery.
      </p>

      <h2 className="mt-8 text-base font-semibold text-slate-900">Limitation of liability</h2>
      <p className="mt-2">
        The platform is provided &quot;as is&quot; without warranties. To the fullest extent
        permitted by law, the operators of Find Your Ride are not liable for any
        disputes, injuries, losses, or damages arising from use of the platform or
        arrangements made between users.
      </p>

      <h2 className="mt-8 text-base font-semibold text-slate-900">Changes</h2>
      <p className="mt-2">
        We may update these terms from time to time. Material changes may require
        you to accept an updated agreement before continuing to use the service.
      </p>

      <p className="mt-8 text-slate-500">
        This is a placeholder document. Consult legal counsel before relying on it
        for production use.
      </p>
    </LegalPageLayout>
  );
}
