'use client';

import { usePathname } from 'next/navigation';
import { Github } from 'lucide-react';
import Container from '@/components/site/Container';
import { getLocaleFromPathname } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';

export default function SiteFooter({
  domain = 'vichengnet.com',
  icp = '蜀ICP备2025127626号-1',
}: {
  domain?: string;
  icp?: string;
}) {
  const pathname = usePathname() || '/';
  const locale = getLocaleFromPathname(pathname);
  const messages = getMessages(locale);

  const startDate = new Date('2026-01-01');
  const runDays = Math.max(1, Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <footer className="border-t border-neutral-200/80 py-8 text-sm text-neutral-500 dark:border-neutral-800/80 dark:text-neutral-400">
      <Container className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-medium text-neutral-900 dark:text-neutral-100">{messages.footer.siteName}</div>
          <div className="mt-1">
            {messages.footer.runFor} {runDays} {messages.footer.runDays}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <span>{domain}</span>
          <a
            href="https://github.com/hezongcheng/vichengnet-website"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="inline-flex items-center text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <Github size={16} />
          </a>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {icp}
          </a>
        </div>
      </Container>
    </footer>
  );
}
