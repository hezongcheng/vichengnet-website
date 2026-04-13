import ContentEditorForm from '@/components/admin/ContentEditorForm';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';
import { findContentBlock } from '@/lib/content-store';

export default async function AdminSeoPage({
  searchParams,
}: {
  searchParams?: { locale?: string };
}) {
  const requested = searchParams?.locale || '';
  const locale: Locale = isLocale(requested) ? requested : defaultLocale;

  const [titleBlock, descBlock] = await Promise.all([
    findContentBlock('seo.default.title', locale),
    findContentBlock('seo.default.description', locale),
  ]);

  return (
    <div className="space-y-8">
      <div className="inline-flex rounded-full border border-neutral-200 p-1 text-sm dark:border-neutral-800">
        <a
          href="/admin/seo?locale=zh"
          className={[
            'rounded-full px-3 py-1.5 transition',
            locale === 'zh'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
          ].join(' ')}
        >
          中文
        </a>
        <a
          href="/admin/seo?locale=en"
          className={[
            'rounded-full px-3 py-1.5 transition',
            locale === 'en'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
          ].join(' ')}
        >
          English
        </a>
      </div>

      <ContentEditorForm
        contentKey="seo.default.title"
        title="SEO 默认标题"
        description="用于全站默认 title"
        initialTitle={titleBlock?.title || '默认标题'}
        initialValue={titleBlock?.value || (locale === 'en' ? 'Vicheng Notes' : '维成小站')}
        type={titleBlock?.type || 'text'}
        locale={locale}
      />

      <ContentEditorForm
        contentKey="seo.default.description"
        title="SEO 默认描述"
        description="用于全站默认 description"
        initialTitle={descBlock?.title || '默认描述'}
        initialValue={
          descBlock?.value ||
          (locale === 'en'
            ? 'A minimal and content-first personal website.'
            : '一个简洁、安静、内容优先的个人站点。')
        }
        type={descBlock?.type || 'text'}
        locale={locale}
      />
    </div>
  );
}
