'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="theme-switch opacity-60" aria-hidden="true"><span className="theme-switch__thumb" /></div>;
  }

  const current = theme === 'system' ? resolvedTheme : theme;
  const checked = current === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(checked ? 'light' : 'dark')}
      className="theme-switch"
      aria-label="切换主题"
      aria-pressed={checked}
      title={checked ? '切换到浅色' : '切换到深色'}
    >
      <span className={`theme-switch__thumb ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}
