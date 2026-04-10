'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  contentKey: string;
  title: string;
  description?: string;
  initialTitle?: string;
  initialValue?: string;
  type?: string;
};

export default function ContentEditorForm({
  contentKey,
  title,
  description,
  initialTitle = '',
  initialValue = '',
  type = 'text',
}: Props) {
  const router = useRouter();
  const [blockTitle, setBlockTitle] = useState(initialTitle);
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function onSave() {
    setLoading(true);
    setMessage('');
    setError('');

    const res = await fetch(`/api/content/${encodeURIComponent(contentKey)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: blockTitle, value, type }),
    });

    setLoading(false);

    if (!res.ok) {
      setError('保存失败，请稍后再试');
      return;
    }

    setMessage('保存成功');
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description ? <p className="mt-1 text-sm text-neutral-500">{description}</p> : null}
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <label className="mb-2 block text-sm font-medium">内容标题</label>
        <input
          value={blockTitle}
          onChange={(e) => setBlockTitle(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-neutral-900"
          placeholder="例如：首页描述"
        />
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <label className="mb-2 block text-sm font-medium">内容值</label>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={10}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-neutral-900"
          placeholder="请输入内容"
        />
      </div>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div> : null}
      {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div> : null}

      <button
        onClick={onSave}
        disabled={loading}
        className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? '保存中...' : '保存内容'}
      </button>
    </div>
  );
}
