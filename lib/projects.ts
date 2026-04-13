export type ProjectItem = {
  nameZh: string;
  nameEn: string;
  descriptionZh: string;
  descriptionEn: string;
  url?: string;
};

export const defaultProjectItems: ProjectItem[] = [
  {
    nameZh: '个人博客系统',
    nameEn: 'Personal Blog System',
    descriptionZh: '基于 Next.js 与 Prisma 的内容站，支持多语言、后台管理和访问统计。',
    descriptionEn: 'A Next.js + Prisma content site with i18n, admin tools, and analytics.',
    url: '',
  },
  {
    nameZh: '工具导航体系',
    nameEn: 'Tool Directory',
    descriptionZh: '整理开发与 AI 工具，支持分类管理与多语言展示。',
    descriptionEn: 'A curated developer and AI tools directory with categories and i18n.',
    url: '',
  },
  {
    nameZh: '建站优化日志',
    nameEn: 'Website Optimization Log',
    descriptionZh: '持续记录性能、SEO 和内容策略优化实践。',
    descriptionEn: 'Ongoing notes on performance, SEO, and content strategy improvements.',
    url: '',
  },
];

export function parseProjectItems(value?: string | null): ProjectItem[] {
  if (!value) return defaultProjectItems;
  try {
    const raw = JSON.parse(value);
    if (!Array.isArray(raw)) return defaultProjectItems;
    const normalized = raw
      .map((item) => ({
        nameZh: String(item?.nameZh || '').trim(),
        nameEn: String(item?.nameEn || '').trim(),
        descriptionZh: String(item?.descriptionZh || '').trim(),
        descriptionEn: String(item?.descriptionEn || '').trim(),
        url: String(item?.url || '').trim(),
      }))
      .filter((item) => item.nameZh || item.nameEn || item.descriptionZh || item.descriptionEn);
    return normalized.length ? normalized : defaultProjectItems;
  } catch {
    return defaultProjectItems;
  }
}

export function stringifyProjectItems(items: ProjectItem[]) {
  return JSON.stringify(
    items.map((item) => ({
      nameZh: item.nameZh.trim(),
      nameEn: item.nameEn.trim(),
      descriptionZh: item.descriptionZh.trim(),
      descriptionEn: item.descriptionEn.trim(),
      url: (item.url || '').trim(),
    }))
  );
}
