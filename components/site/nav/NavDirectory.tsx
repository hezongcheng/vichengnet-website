'use client';

import { useMemo, useState } from 'react';
import Card from '@/components/ui/card';
import type { NavCategory } from '@/lib/nav';

export default function NavDirectory({ categories }: { categories: NavCategory[] }) {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalized) return categories;

    return categories
      .map((category) => ({
        ...category,
        sites: category.sites.filter((site) => {
          const stack = `${site.name} ${site.description} ${site.tags.join(' ')}`.toLowerCase();
          return stack.includes(normalized);
        }),
      }))
      .filter((category) => category.sites.length > 0);
  }, [categories, normalized]);

  const total = filtered.reduce((sum, category) => sum + category.sites.length, 0);

  return (
    <section className="py-8 md:py-10">
      <div className="sticky top-0 z-10 -mx-2 mb-8 rounded-2xl border border-neutral-200/80 bg-white/90 p-3 backdrop-blur dark:border-neutral-800/80 dark:bg-neutral-950/90 md:mx-0">
        <label className="block text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          Search Links
        </label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, description, or tag..."
          className="mt-2 w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-neutral-400 dark:border-neutral-800 dark:focus:border-neutral-500"
        />
        <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {normalized ? `Found ${total} results` : `${total} curated links`}
        </div>
      </div>

      {!filtered.length ? (
        <Card className="text-sm text-neutral-500 dark:text-neutral-400">
          No result found. Try another keyword.
        </Card>
      ) : null}

      <div className="space-y-9">
        {filtered.map((category) => (
          <section key={category.key} id={category.key} className="scroll-mt-24">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">{category.label}</h2>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">{category.sites.length} links</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {category.sites.map((site) => (
                <a
                  key={site.url}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="h-full transition group-hover:-translate-y-0.5 group-hover:border-neutral-300 group-hover:shadow-md dark:group-hover:border-neutral-700">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold tracking-tight">{site.name}</h3>
                      <span className="text-xs text-neutral-400 dark:text-neutral-500">Open</span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">{site.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {site.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
