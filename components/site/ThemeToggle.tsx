'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/i18n/config';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname() || '/';
  const locale = getLocaleFromPathname(pathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const labels =
    locale === 'en'
      ? {
          aria: 'Toggle theme',
          light: 'Switch to light mode',
          dark: 'Switch to dark mode',
        }
      : {
          aria: '切换主题',
          light: '切换到浅色模式',
          dark: '切换到深色模式',
        };

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400"
        aria-label={labels.aria}
      >
        <Sun size={16} />
      </button>
    );
  }

  const current = theme === 'system' ? resolvedTheme : theme;
  const isDark = current === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
      aria-label={labels.aria}
      aria-pressed={isDark}
      title={isDark ? labels.light : labels.dark}
    >
      <Sun
        size={16}
        className={[
          'absolute transition-all duration-200',
          isDark ? 'scale-75 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
        ].join(' ')}
      />
      <Moon
        size={16}
        className={[
          'absolute transition-all duration-200',
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-75 -rotate-90 opacity-0',
        ].join(' ')}
      />
    </button>
  );
}
