'use client';

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

  if (!mounted) {
    return (
      <div className="theme-switch opacity-60" aria-hidden="true">
        <span className="theme-switch__thumb" />
      </div>
    );
  }

  const current = theme === 'system' ? resolvedTheme : theme;
  const checked = current === 'dark';
  const labels =
    locale === 'en'
      ? {
          aria: 'Toggle theme',
          light: 'Switch to light',
          dark: 'Switch to dark',
        }
      : {
          aria: '切换主题',
          light: '切换到浅色',
          dark: '切换到深色',
        };

  return (
    <button
      type="button"
      onClick={() => setTheme(checked ? 'light' : 'dark')}
      className="theme-switch"
      aria-label={labels.aria}
      aria-pressed={checked}
      title={checked ? labels.light : labels.dark}
    >
      <span className={`theme-switch__thumb ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}
