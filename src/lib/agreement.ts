export const AGREEMENT_VERSION = "1.0";
export const AGREEMENT_TITLE = "Before You Continue";
export const AGREEMENT_REQUIRED = true;

export const AGREEMENT_INTRO =
  "Find Your Ride is a free community platform built by parents to help school families connect for transportation. Our role is only to help families find one another. Any communication, ride arrangements, or agreements happen directly between the participating families.";

export const AGREEMENT_PRIVACY_REMINDER =
  "Only share your preferred method of communication, such as phone number or email. Your first and last name are used only for passcode recovery and do not have to be your real name if you prefer to use a nickname or alias that you can remember.";

export const AGREEMENT_CHECKBOXES = [
  {
    id: "connect",
    label:
      "I understand that Find Your Ride only provides a way for families to connect. Any communication, ride arrangements, or agreements are solely between the participating individuals.",
  },
  {
    id: "privacy",
    label:
      "I understand that I should only share the contact information I am comfortable providing. I will not share sensitive personal information such as my home address, financial information, passwords, or other private information through this platform.",
  },
  {
    id: "verify",
    label:
      "I understand that I am responsible for verifying the identity and suitability of anyone I choose to communicate with or arrange transportation through.",
  },
  {
    id: "terms",
    label: "I have read and agree to the Terms of Use and Privacy Policy.",
    links: [
      { href: "/terms", label: "Terms of Use" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
] as const;

export type AgreementCheckboxId = (typeof AGREEMENT_CHECKBOXES)[number]["id"];

export type AgreementRecord = {
  agreementAccepted: boolean;
  agreementVersion: string | null;
};

export function hasAcceptedCurrentAgreement(record: AgreementRecord): boolean {
  if (!AGREEMENT_REQUIRED) return true;
  return (
    record.agreementAccepted &&
    record.agreementVersion === AGREEMENT_VERSION
  );
}

export function agreementAcceptanceData(version: string = AGREEMENT_VERSION) {
  return {
    agreementAccepted: true,
    agreementVersion: version,
    agreementAcceptedAt: new Date(),
    consentGiven: true,
  };
}
