export const SITE_URL = 'https://vichengnet.com';
export const SITE_NAME_ZH = '维成小站';
export const SITE_NAME_EN = 'Vicheng Notes';

export function absoluteUrl(path: string) {
  if (!path.startsWith('/')) return `${SITE_URL}/${path}`;
  return `${SITE_URL}${path}`;
}
