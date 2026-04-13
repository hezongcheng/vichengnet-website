'use client';

import { usePathname } from 'next/navigation';
import { defaultLocale, getLocaleFromPathname, type Locale, withLocalePrefix } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';

export default function LanguageSwitcher() {
  const pathname = usePathname() || '/';
  const locale = getLocaleFromPathname(pathname);
  const messages = getMessages(locale);

  function hrefFor(nextLocale: Locale) {
    return withLocalePrefix(pathname, nextLocale);
  }

  return (
    <div
      className="inline-flex items-center rounded-full border border-neutral-200 p-1 text-xs dark:border-neutral-800"
      aria-label={messages.language.switchTo}
    >
      {(['zh', 'en'] as Locale[]).map((item) => {
        const active = item === locale;
        return (
          <a
            key={item}
            href={hrefFor(item)}
            className={[
              'rounded-full px-2.5 py-1 transition',
              active
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
            ].join(' ')}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${item}; path=/; max-age=31536000`;
            }}
          >
            {messages.language[item]}
          </a>
        );
      })}
      {!locale ? <span className="hidden">{defaultLocale}</span> : null}
    </div>
  );
}
