import { createHash, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const SCRYPT_PREFIX = "scrypt";
const SHA256_PREFIX = "sha256";
const SCRYPT_KEY_LENGTH = 64;

/** One-way SHA-256 hash with per-user salt — legacy format only */
function sha256WithSalt(passcode: string, salt: string): string {
  return createHash("sha256")
    .update(`${salt}:${passcode}`, "utf8")
    .digest("hex");
}

/** One-way scrypt hash with per-user salt — used for all new passcodes */
export async function hashPasscode(passcode: string): Promise<string> {
  const salt = randomBytes(32).toString("hex");
  const derived = (await scryptAsync(passcode, salt, SCRYPT_KEY_LENGTH)) as Buffer;
  return `${SCRYPT_PREFIX}:${salt}:${derived.toString("hex")}`;
}

async function verifyScryptPrefixedHash(
  passcode: string,
  storedHash: string
): Promise<boolean> {
  const parts = storedHash.split(":");
  if (parts.length !== 3 || parts[0] !== SCRYPT_PREFIX) return false;
  const [, salt, key] = parts;
  if (!salt || !key) return false;
  const derived = (await scryptAsync(passcode, salt, SCRYPT_KEY_LENGTH)) as Buffer;
  const keyBuf = Buffer.from(key, "hex");
  if (derived.length !== keyBuf.length) return false;
  return timingSafeEqual(derived, keyBuf);
}

/** Legacy scrypt format: salt:key (no prefix) */
async function verifyLegacyScryptHash(
  passcode: string,
  storedHash: string
): Promise<boolean> {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const derived = (await scryptAsync(passcode, salt, SCRYPT_KEY_LENGTH)) as Buffer;
  const keyBuf = Buffer.from(key, "hex");
  if (derived.length !== keyBuf.length) return false;
  return timingSafeEqual(derived, keyBuf);
}

function verifySha256Hash(passcode: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 3 || parts[0] !== SHA256_PREFIX) return false;
  const [, salt, key] = parts;
  if (!salt || !key) return false;
  const derived = sha256WithSalt(passcode, salt);
  try {
    return timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(key, "hex"));
  } catch {
    return false;
  }
}

export async function verifyPasscode(
  passcode: string,
  storedHash: string
): Promise<boolean> {
  if (!storedHash || storedHash.length < 10) return false;

  if (storedHash.startsWith(`${SCRYPT_PREFIX}:`)) {
    return verifyScryptPrefixedHash(passcode, storedHash);
  }

  if (storedHash.startsWith(`${SHA256_PREFIX}:`)) {
    return verifySha256Hash(passcode, storedHash);
  }

  // Legacy scrypt hashes from earlier versions (salt:key, no prefix)
  return verifyLegacyScryptHash(passcode, storedHash);
}

export function validatePasscode(passcode: string): string | null {
  if (!passcode || passcode.length < 4) {
    return "Passcode must be at least 4 characters.";
  }
  if (passcode.length > 32) {
    return "Passcode must be 32 characters or fewer.";
  }
  return null;
}

/** Reject values that look like plaintext accidentally saved to passcodeHash */
export function assertStoredPasscodeIsHashed(
  storedHash: string,
  plaintext?: string
): void {
  if (!storedHash) {
    throw new Error("Passcode hash is missing.");
  }

  if (plaintext !== undefined && storedHash === plaintext) {
    throw new Error("Plaintext passcodes must not be stored.");
  }

  const isPrefixedHash =
    storedHash.startsWith(`${SCRYPT_PREFIX}:`) ||
    storedHash.startsWith(`${SHA256_PREFIX}:`);

  const isLegacyScrypt =
    !isPrefixedHash &&
    storedHash.includes(":") &&
    storedHash.length >= 40;

  if (!isPrefixedHash && !isLegacyScrypt) {
    throw new Error("Invalid passcode hash format.");
  }

  if (storedHash.length < 40) {
    throw new Error("Passcode hash is too short to be valid.");
  }
}
