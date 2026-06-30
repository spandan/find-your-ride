import type { PreferredContactMethod } from "@/generated/prisma/client";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function looksLikeEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 254) return false;
  return EMAIL_PATTERN.test(trimmed);
}

export function normalizePhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }
  return digits;
}

export function isValidPhone(phone: string): boolean {
  return normalizePhoneDigits(phone).length === 10;
}

export function preferredMethodNeedsPhone(
  method: PreferredContactMethod
): boolean {
  return method === "PHONE" || method === "TEXT" || method === "WHATSAPP";
}

export function resolveContactEmail(
  contactEmail: string,
  loginId: string
): string {
  const email = contactEmail.trim();
  if (email) return email.toLowerCase();
  const login = loginId.trim().toLowerCase();
  if (looksLikeEmail(login)) return login;
  return "";
}

/** Validates contact fields for signup. Returns error message or null. */
export function validateSignupContact(
  preferredMethod: PreferredContactMethod,
  contactEmail: string,
  contactPhone: string | undefined,
  loginId: string
): string | null {
  const resolvedEmail = resolveContactEmail(contactEmail, loginId);
  const phone = contactPhone?.trim() ?? "";

  if (preferredMethod === "EMAIL") {
    if (!resolvedEmail) {
      return "A valid contact email is required when email is your preferred method.";
    }
    if (!isValidEmail(resolvedEmail)) {
      return "Please enter a valid contact email address.";
    }
    return null;
  }

  if (preferredMethodNeedsPhone(preferredMethod)) {
    if (!phone) {
      return "A valid phone number is required for your preferred contact method.";
    }
    if (!isValidPhone(phone)) {
      return "Please enter a valid 10-digit US phone number.";
    }
    if (resolvedEmail && !isValidEmail(resolvedEmail)) {
      return "Please enter a valid email address or leave it blank to use your login email.";
    }
    return null;
  }

  return null;
}
