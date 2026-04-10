'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';

type PostFormValue = {
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string | null;
};

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function PostEditorForm({
  mode,
  initialValue,
}: {
  mode: 'create' | 'edit';
  initialValue?: Partial<PostFormValue>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const defaultValue: PostFormValue = useMemo(
    () => ({
      id: initialValue?.id,
      title: initialValue?.title || '',
      slug: initialValue?.slug || '',
      summary: initialValue?.summary || '',
      content: initialValue?.content || '<p></p>',
      coverImage: initialValue?.coverImage || '',
      category: initialValue?.category || '',
      tags: initialValue?.tags || [],
      seoTitle: initialValue?.seoTitle || '',
      seoDescription: initialValue?.seoDescription || '',
      seoKeywords: initialValue?.seoKeywords || '',
      status: (initialValue?.status as PostFormValue['status']) || 'DRAFT',
      publishedAt: initialValue?.publishedAt || '',
    }),
    [initialValue]
  );

  const [form, setForm] = useState<PostFormValue>(defaultValue);

  useEffect(() => {
    setForm(defaultValue);
  }, [defaultValue]);

  function update<K extends keyof PostFormValue>(key: K, value: PostFormValue[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCoverUpload(file: File) {
    setUploading(true);
    setError('');

    const body = new FormData();
    body.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body,
    });

    setUploading(false);

    if (!res.ok) {
      setError('封面上传失败');
      return;
    }

    const json = await res.json();
    update('coverImage', json.url);
  }

  async function save() {
    setLoading(true);
    setError('');

    const url = mode === 'create' ? '/api/posts' : `/api/posts/${form.id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const json = await res.json().catch(() => null);
      setError(json?.error?.formErrors?.[0] || '保存失败，请检查表单');
      return;
    }

    router.push('/admin/posts');
    router.refresh();
  }

  async function removePost() {
    if (mode !== 'edit' || !form.id) return;
    const confirmed = window.confirm('确认删除这篇文章吗？');
    if (!confirmed) return;

    const res = await fetch(`/api/posts/${form.id}`, { method: 'DELETE' });
    if (!res.ok) {
      setError('删除失败');
      return;
    }

    router.push('/admin/posts');
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="mb-2 block text-sm font-medium">标题</label>
          <input
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              update('title', title);
              if (!form.slug) update('slug', slugify(title));
              if (!form.seoTitle) update('seoTitle', title);
            }}
            className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <label className="mb-2 block text-sm font-medium">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => update('slug', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
            />
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <label className="mb-2 block text-sm font-medium">分类</label>
            <input
              value={form.category || ''}
              onChange={(e) => update('category', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
              placeholder="例如：技术 / 随笔 / 建站"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="mb-2 block text-sm font-medium">摘要 / Description</label>
          <textarea
            value={form.summary || ''}
            onChange={(e) => {
              update('summary', e.target.value);
              if (!form.seoDescription) update('seoDescription', e.target.value);
            }}
            rows={4}
            className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
          />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="block text-sm font-medium">正文内容</label>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Tiptap 富文本编辑器
            </span>
          </div>
          <RichTextEditor value={form.content} onChange={(value) => update('content', value)} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="mb-2 block text-sm font-medium">状态</label>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value as PostFormValue['status'])}
            className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
          >
            <option value="DRAFT">草稿</option>
            <option value="PUBLISHED">已发布</option>
            <option value="ARCHIVED">已归档</option>
          </select>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="mb-2 block text-sm font-medium">发布时间</label>
          <input
            value={form.publishedAt || ''}
            onChange={(e) => update('publishedAt', e.target.value)}
            type="datetime-local"
            className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
          />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">封面图地址</label>
            <input
              value={form.coverImage || ''}
              onChange={(e) => update('coverImage', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
              placeholder="/uploads/xxx.png"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">上传封面图</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCoverUpload(file);
              }}
              className="block w-full text-sm"
            />
            <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              {uploading ? '上传中...' : '支持选择本地图片上传'}
            </div>
          </div>

          {form.coverImage ? (
            <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
              <img src={form.coverImage} alt="cover preview" className="h-44 w-full object-cover" />
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="mb-2 block text-sm font-medium">标签</label>
          <input
            value={form.tags.join(', ')}
            onChange={(e) =>
              update(
                'tags',
                e.target.value
                  .split(',')
                  .map((i) => i.trim())
                  .filter(Boolean)
              )
            }
            className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
            placeholder="nextjs, blog, life"
          />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">SEO 标题</label>
            <input
              value={form.seoTitle || ''}
              onChange={(e) => update('seoTitle', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
              placeholder="留空时默认使用文章标题"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">SEO 描述</label>
            <textarea
              value={form.seoDescription || ''}
              onChange={(e) => update('seoDescription', e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
              placeholder="留空时默认使用摘要"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">SEO Keywords</label>
            <input
              value={form.seoKeywords || ''}
              onChange={(e) => update('seoKeywords', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
              placeholder="个人博客, Next.js, 技术文章"
            />
          </div>
        </div>

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">{error}</div> : null}

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-3">
            <button
              onClick={save}
              disabled={loading}
              className="rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
            >
              {loading ? '保存中...' : mode === 'create' ? '创建文章' : '保存修改'}
            </button>

            {mode === 'edit' ? (
              <button
                onClick={removePost}
                className="rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:text-red-300"
              >
                删除文章
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
