export const locales = ['zh', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getLocaleFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split('/').filter(Boolean)[0] || '';
  return isLocale(firstSegment) ? firstSegment : defaultLocale;
}

export function stripLocalePrefix(pathname: string): string {
  const firstSegment = pathname.split('/').filter(Boolean)[0] || '';
  if (!isLocale(firstSegment)) return pathname;
  const stripped = pathname.slice(firstSegment.length + 1);
  return stripped || '/';
}

export function withLocalePrefix(pathname: string, locale: Locale): string {
  const localPath = stripLocalePrefix(pathname);
  if (locale === defaultLocale) return localPath;
  return localPath === '/' ? `/${locale}` : `/${locale}${localPath}`;
}
