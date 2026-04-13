'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, type Locale, withLocalePrefix } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';

const localeOptions: Array<{ value: Locale; label: string; flag: string }> = [
  { value: 'zh', label: 'ZH', flag: 'https://flagcdn.com/w20/cn.png' },
  { value: 'en', label: 'EN', flag: 'https://flagcdn.com/w20/us.png' },
];

export default function LanguageSwitcher() {
  const pathname = usePathname() || '/';
  const locale = getLocaleFromPathname(pathname);
  const messages = getMessages(locale);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const current = localeOptions.find((item) => item.value === locale) || localeOptions[0];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function onSelect(nextLocale: Locale) {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    window.location.href = withLocalePrefix(pathname, nextLocale);
  }

  return (
    <div ref={rootRef} className='relative'>
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        className='inline-flex min-w-[124px] items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 transition hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700'
        aria-label={messages.language.switchTo}
        aria-expanded={open}
      >
        <img src={current.flag} alt='' className='h-3.5 w-5 rounded-[2px] object-cover' />
        <span>{current.label}</span>
        <span className='ml-auto text-[10px] text-neutral-400 dark:text-neutral-500'>v</span>
      </button>

      {open ? (
        <div className='absolute right-0 top-10 z-30 min-w-[152px] overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-md dark:border-neutral-800 dark:bg-neutral-900'>
          {localeOptions.map((item) => (
            <button
              key={item.value}
              type='button'
              onClick={() => onSelect(item.value)}
              className={[
                'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition',
                item.value === locale
                  ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                  : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/70',
              ].join(' ')}
            >
              <img src={item.flag} alt='' className='h-3.5 w-5 rounded-[2px] object-cover' />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}