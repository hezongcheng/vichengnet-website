import SettingsForm from '@/components/admin/SettingsForm';
import { findContentBlock } from '@/lib/content-store';
import { getAdminLocale } from '@/lib/i18n/admin';

export default async function AdminSettingsPage() {
  const locale = getAdminLocale();
  const isEn = locale === 'en';

  const sharedKeys = new Set(['site.footer.domain', 'site.footer.icp']);

  const settingDefinitions = isEn
    ? [
        { section: 'Basic Settings', key: 'site.name', title: 'Site Name', type: 'text', description: 'Shown in site header and footer brand text' },
        { section: 'Basic Settings', key: 'site.footer.domain', title: 'Domain', type: 'text', description: 'For example: vichengnet.com' },
        { section: 'Basic Settings', key: 'site.footer.icp', title: 'ICP Record', type: 'text', description: 'Displayed in footer' },
        { section: 'Basic Settings', key: 'home.hero.title', title: 'Home Hero Title', type: 'text', description: 'Main title on homepage' },
        { section: 'Basic Settings', key: 'home.hero.description', title: 'Home Hero Description', type: 'textarea', description: 'Description on homepage hero section' },
        { section: 'Basic Settings', key: 'about.body', title: 'About Content', type: 'textarea', description: 'Main body of About page' },
        { section: 'SEO Settings', key: 'seo.default.title', title: 'Default SEO Title', type: 'text', description: 'Default title for pages without custom SEO title' },
        {
          section: 'SEO Settings',
          key: 'seo.default.description',
          title: 'Default SEO Description',
          type: 'textarea',
          description: 'Default description for pages without custom SEO description',
        },
      ]
    : [
        { section: '基础设置', key: 'site.name', title: '站点名称', type: 'text', description: '显示在页头与页脚品牌文案中' },
        { section: '基础设置', key: 'site.footer.domain', title: '站点域名', type: 'text', description: '例如：vichengnet.com' },
        { section: '基础设置', key: 'site.footer.icp', title: '备案号', type: 'text', description: '显示在页脚' },
        { section: '基础设置', key: 'home.hero.title', title: '首页主标题', type: 'text', description: '首页第一屏主文案' },
        { section: '基础设置', key: 'home.hero.description', title: '首页描述', type: 'textarea', description: '首页介绍内容' },
        { section: '基础设置', key: 'about.body', title: '关于页内容', type: 'textarea', description: '关于页面正文' },
        { section: 'SEO 设置', key: 'seo.default.title', title: 'SEO 默认标题', type: 'text', description: '用于未单独设置 SEO 标题的页面' },
        {
          section: 'SEO 设置',
          key: 'seo.default.description',
          title: 'SEO 默认描述',
          type: 'textarea',
          description: '用于未单独设置 SEO 描述的页面',
        },
      ];

  const blocks = await Promise.all(
    settingDefinitions.map((item) => findContentBlock(item.key, sharedKeys.has(item.key) ? 'zh' : locale))
  );

  const items = settingDefinitions.map((definition) => {
    const saved = blocks.find((block) => block?.key === definition.key);
    return {
      section: definition.section,
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
        <h2 className="text-2xl font-semibold tracking-tight">{isEn ? 'System Settings' : '系统设置'}</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {isEn ? 'Maintain site profile and homepage copy.' : '统一维护站点基础信息与首页文案。'}
        </p>
        <div className="mt-3 inline-flex rounded-full border border-neutral-200 p-1 text-sm dark:border-neutral-800">
          <a
            href="/zh/admin/settings"
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
            href="/en/admin/settings"
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
