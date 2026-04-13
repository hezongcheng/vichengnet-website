import './globals.css';
import type { Metadata } from 'next';
import ThemeProvider from '@/components/site/ThemeProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://vichengnet.com'),
  title: {
    default: '维成小站',
    template: '%s - 维成小站',
  },
  description: '一个简洁、安静、内容优先的个人站点。',
  alternates: {
    canonical: 'https://vichengnet.com',
    languages: {
      'zh-CN': '/zh',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: '维成小站',
    description: '一个简洁、安静、内容优先的个人站点。',
    url: 'https://vichengnet.com',
    siteName: '维成小站',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '维成小站',
    description: '一个简洁、安静、内容优先的个人站点。',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
