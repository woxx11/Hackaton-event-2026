// Normalizes a phone number to digits-only (keeping a leading "+" if
// present) so "+998 90 123 45 67", "998901234567", and "90-123-45-67" all
// collide on the same uniqueness check instead of silently registering as
// different accounts.
export function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}
