export const SHIP_ZIP_COOKIE = 'hw420_ship_zip';
export const SHIP_ZIP_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

export function isValidZip(value: string | null | undefined): value is string {
  return !!value && /^\d{5}$/.test(value.trim());
}

export function readShipZipFromCookieString(cookieHeader: string | null | undefined): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${SHIP_ZIP_COOKIE}=`));
  if (!match) return null;
  const value = decodeURIComponent(match.split('=')[1] ?? '');
  return isValidZip(value) ? value : null;
}

export function readShipZipFromDocument(): string | null {
  if (typeof document === 'undefined') return null;
  return readShipZipFromCookieString(document.cookie);
}

export function writeShipZipToDocument(zip: string) {
  if (typeof document === 'undefined' || !isValidZip(zip)) return;
  const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${SHIP_ZIP_COOKIE}=${encodeURIComponent(zip)}; path=/; max-age=${SHIP_ZIP_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function clearShipZipFromDocument() {
  if (typeof document === 'undefined') return;
  document.cookie = `${SHIP_ZIP_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
