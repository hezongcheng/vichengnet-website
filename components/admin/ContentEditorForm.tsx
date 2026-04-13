'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';

type Props = {
  contentKey: string;
  title: string;
  description?: string;
  initialTitle?: string;
  initialValue?: string;
  type?: string;
  locale: Locale;
};

export default function ContentEditorForm({
  contentKey,
  title,
  description,
  initialTitle = '',
  initialValue = '',
  type = 'text',
  locale,
}: Props) {
  const router = useRouter();
  const [blockTitle, setBlockTitle] = useState(initialTitle);
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const t = useMemo(
    () =>
      locale === 'en'
        ? {
            saveFailed: 'Save failed, please try again later.',
            saveSuccess: 'Saved successfully.',
            contentTitle: 'Content Title',
            contentValue: 'Content Value',
            titlePlaceholder: 'e.g. Homepage Description',
            valuePlaceholder: 'Enter content...',
            saving: 'Saving...',
            save: 'Save Content',
          }
        : {
            saveFailed: '保存失败，请稍后再试',
            saveSuccess: '保存成功',
            contentTitle: '内容标题',
            contentValue: '内容值',
            titlePlaceholder: '例如：首页描述',
            valuePlaceholder: '请输入内容',
            saving: '保存中...',
            save: '保存内容',
          },
    [locale]
  );

  async function onSave() {
    setLoading(true);
    setMessage('');
    setError('');

    const res = await fetch(`/api/content/${encodeURIComponent(contentKey)}?locale=${locale}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: blockTitle, value, type }),
    });

    setLoading(false);

    if (!res.ok) {
      setError(t.saveFailed);
      return;
    }

    setMessage(t.saveSuccess);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description ? <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{description}</p> : null}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <label className="mb-2 block text-sm font-medium">{t.contentTitle}</label>
        <input
          value={blockTitle}
          onChange={(e) => setBlockTitle(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
          placeholder={t.titlePlaceholder}
        />
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <label className="mb-2 block text-sm font-medium">{t.contentValue}</label>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={10}
          className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
          placeholder={t.valuePlaceholder}
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          {message}
        </div>
      ) : null}

      <button
        onClick={onSave}
        disabled={loading}
        className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
      >
        {loading ? t.saving : t.save}
      </button>
    </div>
  );
}
