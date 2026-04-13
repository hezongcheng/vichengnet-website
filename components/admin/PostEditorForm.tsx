'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';
import type { Locale } from '@/lib/i18n/config';

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
  locale = 'zh',
}: {
  mode: 'create' | 'edit';
  initialValue?: Partial<PostFormValue>;
  locale?: Locale;
}) {
  const isEn = locale === 'en';
  const t = isEn
    ? {
        uploadFail: 'Cover upload failed',
        saveFail: 'Save failed, please check your form input',
        deleteConfirm: 'Are you sure you want to delete this post?',
        deleteFail: 'Delete failed',
        title: 'Title',
        category: 'Category',
        categoryPh: 'e.g. Tech / Notes / Building',
        summary: 'Summary / Description',
        content: 'Content',
        editor: 'Tiptap Rich Text Editor',
        status: 'Status',
        draft: 'Draft',
        published: 'Published',
        archived: 'Archived',
        publishedAt: 'Published At',
        coverUrl: 'Cover URL',
        coverUpload: 'Upload Cover',
        uploading: 'Uploading...',
        uploadHint: 'Upload local image as cover',
        tags: 'Tags',
        seoTitle: 'SEO Title',
        seoTitlePh: 'Fallback to post title if empty',
        seoDesc: 'SEO Description',
        seoDescPh: 'Fallback to summary if empty',
        seoKeywordsPh: 'blog, nextjs, frontend',
        save: mode === 'create' ? 'Create Post' : 'Save Changes',
        saving: 'Saving...',
        remove: 'Delete Post',
      }
    : {
        uploadFail: '封面上传失败',
        saveFail: '保存失败，请检查表单',
        deleteConfirm: '确认删除这篇文章吗？',
        deleteFail: '删除失败',
        title: '标题',
        category: '分类',
        categoryPh: '例如：技术 / 随笔 / 建站',
        summary: '摘要 / Description',
        content: '正文内容',
        editor: 'Tiptap 富文本编辑器',
        status: '状态',
        draft: '草稿',
        published: '已发布',
        archived: '已归档',
        publishedAt: '发布时间',
        coverUrl: '封面图地址',
        coverUpload: '上传封面图',
        uploading: '上传中...',
        uploadHint: '支持选择本地图片上传',
        tags: '标签',
        seoTitle: 'SEO 标题',
        seoTitlePh: '留空时默认使用文章标题',
        seoDesc: 'SEO 描述',
        seoDescPh: '留空时默认使用摘要',
        seoKeywordsPh: '个人博客, Next.js, 技术文章',
        save: mode === 'create' ? '创建文章' : '保存修改',
        saving: '保存中...',
        remove: '删除文章',
      };

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
    const res = await fetch('/api/upload', { method: 'POST', body });
    setUploading(false);
    if (!res.ok) {
      setError(t.uploadFail);
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
      setError(json?.error?.formErrors?.[0] || t.saveFail);
      return;
    }
    router.push('/admin/posts');
    router.refresh();
  }

  async function removePost() {
    if (mode !== 'edit' || !form.id) return;
    if (!window.confirm(t.deleteConfirm)) return;
    const res = await fetch(`/api/posts/${form.id}`, { method: 'DELETE' });
    if (!res.ok) {
      setError(t.deleteFail);
      return;
    }
    router.push('/admin/posts');
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="mb-2 block text-sm font-medium">{t.title}</label>
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
            <label className="mb-2 block text-sm font-medium">{t.category}</label>
            <input
              value={form.category || ''}
              onChange={(e) => update('category', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
              placeholder={t.categoryPh}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="mb-2 block text-sm font-medium">{t.summary}</label>
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
            <label className="block text-sm font-medium">{t.content}</label>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{t.editor}</span>
          </div>
          <RichTextEditor value={form.content} onChange={(value) => update('content', value)} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="mb-2 block text-sm font-medium">{t.status}</label>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value as PostFormValue['status'])}
            className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
          >
            <option value="DRAFT">{t.draft}</option>
            <option value="PUBLISHED">{t.published}</option>
            <option value="ARCHIVED">{t.archived}</option>
          </select>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="mb-2 block text-sm font-medium">{t.publishedAt}</label>
          <input
            value={form.publishedAt || ''}
            onChange={(e) => update('publishedAt', e.target.value)}
            type="datetime-local"
            className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
          />
        </div>

        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <label className="mb-2 block text-sm font-medium">{t.coverUrl}</label>
            <input
              value={form.coverImage || ''}
              onChange={(e) => update('coverImage', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
              placeholder="/uploads/xxx.png"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">{t.coverUpload}</label>
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
              {uploading ? t.uploading : t.uploadHint}
            </div>
          </div>
          {form.coverImage ? (
            <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
              <img src={form.coverImage} alt="cover preview" className="h-44 w-full object-cover" />
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="mb-2 block text-sm font-medium">{t.tags}</label>
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

        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <label className="mb-2 block text-sm font-medium">{t.seoTitle}</label>
            <input
              value={form.seoTitle || ''}
              onChange={(e) => update('seoTitle', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
              placeholder={t.seoTitlePh}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">{t.seoDesc}</label>
            <textarea
              value={form.seoDescription || ''}
              onChange={(e) => update('seoDescription', e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
              placeholder={t.seoDescPh}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">SEO Keywords</label>
            <input
              value={form.seoKeywords || ''}
              onChange={(e) => update('seoKeywords', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
              placeholder={t.seoKeywordsPh}
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
              {loading ? t.saving : t.save}
            </button>
            {mode === 'edit' ? (
              <button
                onClick={removePost}
                className="rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:text-red-300"
              >
                {t.remove}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
