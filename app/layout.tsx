import './globals.css';
import type { Metadata } from 'next';
import ThemeProvider from '@/components/site/ThemeProvider';
import { absoluteUrl, SITE_NAME_ZH } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://vichengnet.com'),
  title: {
    default: 'Vicheng Blog',
    template: '%s | Vicheng Blog',
  },
  description: 'A content-first tech blog focused on frontend development, AI tooling, and website building.',
  keywords: ['Vicheng Blog', 'Frontend', 'Next.js', 'TypeScript', 'AI', 'Tech Blog', 'Web Development'],
  alternates: {
    canonical: 'https://vichengnet.com',
    languages: {
      'zh-CN': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    title: 'Vicheng Blog',
    description: 'Frontend, AI tooling, and practical website building notes.',
    url: 'https://vichengnet.com',
    siteName: 'Vicheng Blog',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vicheng Blog',
    description: 'Frontend, AI tooling, and practical website building notes.',
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
      target: absoluteUrl('/search?q={search_term_string}'),
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang='zh-CN' suppressHydrationWarning>
      <body className='bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100'>
        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
