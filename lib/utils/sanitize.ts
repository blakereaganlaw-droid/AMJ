export function sanitizeText(value: string | null | undefined, maxLength = 5000): string | null {
  if (value == null || value === "") return null;
  const trimmed = value.trim().slice(0, maxLength);
  return trimmed.length > 0 ? trimmed : null;
}

export function sanitizeShortText(value: string | null | undefined, maxLength = 200): string {
  if (value == null) return "";
  return value.trim().slice(0, maxLength);
}
