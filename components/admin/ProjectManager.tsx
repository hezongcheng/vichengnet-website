'use client';

import { useState } from 'react';
import { parseProjectItems, stringifyProjectItems, type ProjectItem } from '@/lib/projects';

function emptyItem(): ProjectItem {
  return { nameZh: '', nameEn: '', descriptionZh: '', descriptionEn: '', url: '' };
}

export default function ProjectManager({ initialValue }: { initialValue: string }) {
  const [items, setItems] = useState<ProjectItem[]>(parseProjectItems(initialValue));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function update(index: number, patch: Partial<ProjectItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function move(index: number, step: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + step;
      if (target < 0 || target >= prev.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function onSave() {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/content/projects.items?locale=zh', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Projects Items',
          value: stringifyProjectItems(items),
          type: 'json',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || '保存失败');
      setMessage('项目数据已保存');
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, emptyItem()])}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
        >
          添加项目
        </button>
      </div>

      {items.map((item, index) => (
        <section key={index} className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-300">项目 #{index + 1}</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs disabled:opacity-40 dark:border-neutral-700"
              >
                上移
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs disabled:opacity-40 dark:border-neutral-700"
              >
                下移
              </button>
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 dark:border-red-900/50 dark:text-red-300"
              >
                删除
              </button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={item.nameZh}
              onChange={(e) => update(index, { nameZh: e.target.value })}
              placeholder="中文项目名"
              className="rounded-xl border border-neutral-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-200"
            />
            <input
              value={item.nameEn}
              onChange={(e) => update(index, { nameEn: e.target.value })}
              placeholder="English project name"
              className="rounded-xl border border-neutral-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-200"
            />
            <input
              value={item.url || ''}
              onChange={(e) => update(index, { url: e.target.value })}
              placeholder="链接（可选）例如 https://example.com"
              className="rounded-xl border border-neutral-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-200 md:col-span-2"
            />
            <textarea
              value={item.descriptionZh}
              onChange={(e) => update(index, { descriptionZh: e.target.value })}
              placeholder="中文描述"
              rows={4}
              className="rounded-xl border border-neutral-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-200"
            />
            <textarea
              value={item.descriptionEn}
              onChange={(e) => update(index, { descriptionEn: e.target.value })}
              placeholder="English description"
              rows={4}
              className="rounded-xl border border-neutral-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-200"
            />
          </div>
        </section>
      ))}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">{error}</div>
      ) : null}
      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">{message}</div>
      ) : null}

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
      >
        {saving ? '保存中...' : '保存项目'}
      </button>
    </div>
  );
}
