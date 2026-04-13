export type NavSite = {
  name: string;
  url: string;
  description: string;
  tags: string[];
};

export type NavCategory = {
  id?: string;
  key: string;
  label: string;
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
  categories: Array<{
    id: string;
    key: string;
    label: string;
    sites: Array<{
      id: string;
      name: string;
      url: string;
      description: string | null;
      tags: string[];
    }>;
  }>
): NavCategory[] {
  return categories.map((category) => ({
    id: category.id,
    key: category.key,
    label: category.label,
    sites: category.sites.map((site) => ({
      name: site.name,
      url: site.url,
      description: site.description || '',
      tags: site.tags,
    })),
  }));
}
