import type { Locale } from '@/lib/i18n/config';
import en from '@/lib/i18n/messages/en';
import zh from '@/lib/i18n/messages/zh';

export function getMessages(locale: Locale) {
  return locale === 'en' ? en : zh;
}
