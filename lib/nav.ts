import type { Locale } from '@/lib/i18n/config';

export type NavSite = {
  id?: string;
  name: string;
  nameZh?: string;
  nameEn?: string;
  url: string;
  description: string;
  descriptionZh?: string;
  descriptionEn?: string;
  tags: string[];
};

export type NavCategory = {
  id?: string;
  key: string;
  label: string;
  labelZh?: string;
  labelEn?: string;
  sites: NavSite[];
};

export const defaultNavCategories: NavCategory[] = [
  {
    key: 'ai-tools',
    label: 'AI Tools',
    sites: [
      {
        name: 'OpenAI',
        url: 'https://openai.com',
        description: 'Models, API docs, and product updates.',
        tags: ['llm', 'api', 'platform'],
      },
      {
        name: 'Hugging Face',
        url: 'https://huggingface.co',
        description: 'Open models, datasets, and ML tooling.',
        tags: ['model', 'dataset', 'community'],
      },
      {
        name: 'Replicate',
        url: 'https://replicate.com',
        description: 'Run and deploy ML models with simple APIs.',
        tags: ['inference', 'api', 'deploy'],
      },
    ],
  },
  {
    key: 'dev',
    label: 'Development',
    sites: [
      {
        name: 'MDN Web Docs',
        url: 'https://developer.mozilla.org',
        description: 'Core reference for HTML, CSS, and JavaScript.',
        tags: ['frontend', 'reference', 'web'],
      },
      {
        name: 'Next.js Docs',
        url: 'https://nextjs.org/docs',
        description: 'Official documentation for Next.js framework.',
        tags: ['nextjs', 'react', 'docs'],
      },
      {
        name: 'TypeScript',
        url: 'https://www.typescriptlang.org/docs',
        description: 'TypeScript language handbook and reference.',
        tags: ['typescript', 'language', 'docs'],
      },
    ],
  },
  {
    key: 'design',
    label: 'Design',
    sites: [
      {
        name: 'Figma Community',
        url: 'https://www.figma.com/community',
        description: 'UI kits, templates, and design systems.',
        tags: ['ui', 'ux', 'template'],
      },
      {
        name: 'Dribbble',
        url: 'https://dribbble.com',
        description: 'Visual inspiration from product designers.',
        tags: ['inspiration', 'showcase', 'visual'],
      },
      {
        name: 'Awwwards',
        url: 'https://www.awwwards.com',
        description: 'Curated collection of creative web experiences.',
        tags: ['showcase', 'web', 'creative'],
      },
    ],
  },
  {
    key: 'productivity',
    label: 'Productivity',
    sites: [
      {
        name: 'Notion',
        url: 'https://www.notion.so',
        description: 'Notes, docs, and team workspace platform.',
        tags: ['notes', 'workspace', 'planning'],
      },
      {
        name: 'Linear',
        url: 'https://linear.app',
        description: 'Issue tracking and project execution workflow.',
        tags: ['project', 'issue', 'team'],
      },
      {
        name: 'Raycast',
        url: 'https://www.raycast.com',
        description: 'Productivity launcher and automation extensions.',
        tags: ['launcher', 'automation', 'tool'],
      },
    ],
  },
];

export function normalizeNavCategoryKey(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function mapDbCategoriesToNav(
  locale: Locale,
  categories: Array<{
    id: string;
    key: string;
    label: string;
    labelZh: string | null;
    labelEn: string | null;
    sites: Array<{
      id: string;
      name: string;
      nameZh: string | null;
      nameEn: string | null;
      url: string;
      description: string | null;
      descriptionZh: string | null;
      descriptionEn: string | null;
      tags: string[];
    }>;
  }>
): NavCategory[] {
  const isEn = locale === 'en';
  return categories.map((category) => ({
    id: category.id,
    key: category.key,
    label: isEn
      ? category.labelEn || category.label || category.labelZh || category.key
      : category.labelZh || category.label || category.labelEn || category.key,
    labelZh: category.labelZh || category.label,
    labelEn: category.labelEn || category.label,
    sites: category.sites.map((site) => ({
      id: site.id,
      name: isEn
        ? site.nameEn || site.name || site.nameZh || site.url
        : site.nameZh || site.name || site.nameEn || site.url,
      nameZh: site.nameZh || site.name,
      nameEn: site.nameEn || site.name,
      url: site.url,
      description: isEn
        ? site.descriptionEn || site.description || site.descriptionZh || ''
        : site.descriptionZh || site.description || site.descriptionEn || '',
      descriptionZh: site.descriptionZh || site.description || '',
      descriptionEn: site.descriptionEn || site.description || '',
      tags: site.tags,
    })),
  }));
}
