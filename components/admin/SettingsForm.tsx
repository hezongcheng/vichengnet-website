'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n/config';

type SettingItem = {
  key: string;
  title: string;
  value: string;
  type?: string;
  description?: string;
};

export default function SettingsForm({
  initialItems,
  locale,
}: {
  initialItems: SettingItem[];
  locale: Locale;
}) {
  const [items, setItems] = useState(initialItems);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function updateItem(key: string, value: string) {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, value } : item)));
  }

  async function onSave() {
    setSaving(true);
    setMessage('');
    setError('');

    const res = await fetch(`/api/settings?locale=${locale}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    setSaving(false);

    if (!res.ok) {
      setError('保存失败，请稍后重试');
      return;
    }

    setMessage('设置已保存');
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.key} className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="mb-2 block text-sm font-medium">{item.title}</label>
          {item.description ? (
            <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">{item.description}</p>
          ) : null}
          {item.type === 'textarea' ? (
            <textarea
              value={item.value}
              onChange={(e) => updateItem(item.key, e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
            />
          ) : (
            <input
              value={item.value}
              onChange={(e) => updateItem(item.key, e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
            />
          )}
        </div>
      ))}

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">{error}</div> : null}
      {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">{message}</div> : null}

      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
      >
        {saving ? '保存中...' : '保存设置'}
      </button>
    </div>
  );
}
