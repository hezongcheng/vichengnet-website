import { prisma } from '@/lib/prisma';
import SettingsForm from '@/components/admin/SettingsForm';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';

const settingDefinitions = [
  { key: 'site.name', title: '站点名称', type: 'text', description: '显示在页头和默认 SEO 中' },
  { key: 'site.footer.domain', title: '站点域名', type: 'text', description: '例如：vichengnet.com' },
  { key: 'site.footer.icp', title: '备案号', type: 'text', description: '显示在页脚' },
  { key: 'home.hero.title', title: '首页主标题', type: 'text', description: '首页第一屏主文案' },
  { key: 'home.hero.description', title: '首页描述', type: 'textarea', description: '首页介绍内容' },
  { key: 'about.body', title: '关于页内容', type: 'textarea', description: '关于页面正文' },
  { key: 'seo.default.title', title: 'SEO 默认标题', type: 'text', description: '全站默认标题' },
  { key: 'seo.default.description', title: 'SEO 默认描述', type: 'textarea', description: '全站默认描述' },
];

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams?: { locale?: string };
}) {
  const requested = searchParams?.locale || '';
  const locale: Locale = isLocale(requested) ? requested : defaultLocale;

  const blocks = await prisma.contentBlock.findMany({
    where: {
      key: { in: settingDefinitions.map((item) => item.key) },
      locale,
    },
  });

  const items = settingDefinitions.map((definition) => {
    const saved = blocks.find((block) => block.key === definition.key);
    return {
      key: definition.key,
      title: saved?.title || definition.title,
      value: saved?.value || '',
      type: definition.type,
      description: definition.description,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">系统设置</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          统一维护站点基础信息、首页文案和默认 SEO 设置
        </p>
        <div className="mt-3 inline-flex rounded-full border border-neutral-200 p-1 text-sm dark:border-neutral-800">
          <a
            href="/admin/settings?locale=zh"
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
            href="/admin/settings?locale=en"
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
      </div>

      <SettingsForm initialItems={items} locale={locale} />
    </div>
  );
}
