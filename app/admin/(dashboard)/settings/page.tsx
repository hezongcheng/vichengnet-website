import { prisma } from '@/lib/prisma';
import SettingsForm from '@/components/admin/SettingsForm';

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

export default async function AdminSettingsPage() {
  const blocks = await prisma.contentBlock.findMany({
    where: {
      key: { in: settingDefinitions.map((item) => item.key) },
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
      </div>

      <SettingsForm initialItems={items} />
    </div>
  );
}
