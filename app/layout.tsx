import './globals.css';
import type { Metadata } from 'next';
import ThemeProvider from '@/components/site/ThemeProvider';
import { absoluteUrl, SITE_NAME_ZH } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://vichengnet.com'),
  title: {
    default: '维成小站',
    template: '%s | 维成小站',
  },
  description: '维成小站专注于前端开发、AI 工具实践、建站经验与项目复盘，持续分享高质量技术文章。',
  keywords: [
    '维成小站',
    '前端开发',
    'Next.js',
    'TypeScript',
    'AI 工具',
    '技术博客',
    '建站经验',
    '项目复盘',
  ],
  alternates: {
    canonical: 'https://vichengnet.com',
    languages: {
      'zh-CN': '/zh',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    title: '维成小站',
    description: '专注前端开发、AI 工具实践与建站经验的技术博客。',
    url: 'https://vichengnet.com',
    siteName: '维成小站',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '维成小站',
    description: '专注前端开发、AI 工具实践与建站经验的技术博客。',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME_ZH,
    url: absoluteUrl('/'),
    inLanguage: ['zh-CN', 'en-US'],
    potentialAction: {
      '@type': 'SearchAction',
      target: absoluteUrl('/zh/search?q={search_term_string}'),
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
