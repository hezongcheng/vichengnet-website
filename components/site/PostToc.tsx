import { TocItem } from '@/lib/toc';

export default function PostToc({ items }: { items: TocItem[] }) {
  if (!items.length) return null;

  return (
    <aside className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">文章目录</div>
      <nav className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block hover:text-neutral-900 dark:hover:text-neutral-100 ${item.level === 3 ? 'pl-4' : ''}`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
