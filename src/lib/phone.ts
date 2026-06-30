/** Digits only; 10-digit US local number (drops a leading country code 1). */
export function normalizePhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }
  return digits;
}

export function isValidUsPhone(phone: string): boolean {
  return normalizePhoneDigits(phone).length === 10;
}

/** Show the stored value as-is — no US formatting. */
export function displayPhoneNumber(phone: string): string {
  return phone;
}

/** Click-to-dial href; does not change visible text. */
export function phoneTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return `tel:${phone}`;
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  return `tel:+${digits}`;
}
