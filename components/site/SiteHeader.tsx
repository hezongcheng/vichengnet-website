'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Container from '@/components/site/Container';
import ThemeToggle from '@/components/site/ThemeToggle';

const navItems = [
  { href: '/', label: '首页' },
  { href: '/posts', label: '文章' },
  { href: '/nav', label: '导航' },
  { href: '/projects', label: '项目' },
  { href: '/about', label: '关于' },
  { href: '/search', label: '搜索' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-neutral-200/80 dark:border-neutral-800/80">
      <Container>
        <div className="flex items-center justify-between py-4">
          <div className="flex min-w-0 items-center gap-6">
            <a href="/" className="shrink-0 text-sm font-semibold tracking-tight">
              Hi, 维成
            </a>

            <nav className="hidden items-center gap-5 text-sm text-neutral-500 md:flex dark:text-neutral-400">
              {navItems.map((item) => {
                const active = item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={[
                      'relative transition hover:text-neutral-900 dark:hover:text-neutral-100',
                      active ? 'text-neutral-900 dark:text-neutral-100' : '',
                    ].join(' ')}
                  >
                    {item.label}
                    {active ? (
                      <span className="absolute -bottom-2 left-0 h-px w-full bg-neutral-900 dark:bg-neutral-100" />
                    ) : null}
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-xs text-neutral-400 lg:block dark:text-neutral-500">Theme</div>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50 md:hidden dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
              aria-label="切换导航"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="pb-4 md:hidden">
            <nav className="rounded-2xl border border-neutral-200/80 bg-white/90 p-2 text-sm shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/90">
              {navItems.map((item) => {
                const active = item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={[
                      'block rounded-xl px-3 py-2.5 transition',
                      active
                        ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                        : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/80 dark:hover:text-neutral-100',
                    ].join(' ')}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
        ) : null}
      </Container>
    </header>
  );
}

