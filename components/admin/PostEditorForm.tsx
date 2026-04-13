'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';
import type { Locale } from '@/lib/i18n/config';

type PostFormValue = {
  id?: string;
  title: string;
  titleEn?: string;
  slug: string;
  summary?: string;
  summaryEn?: string;
  content: string;
  contentEn?: string;
  coverImage?: string;
  category?: string;
  categoryEn?: string;
  tags: string[];
  seoTitle?: string;
  seoTitleEn?: string;
  seoDescription?: string;
  seoDescriptionEn?: string;
  seoKeywords?: string;
  seoKeywordsEn?: string;
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
        zhTab: 'Chinese',
        enTab: 'English',
        title: 'Title',
        titleEn: 'Title',
        titleEnPh: 'English title for /en page',
        summary: 'Summary',
        summaryEn: 'Summary',
        content: 'Content',
        contentEn: 'Content',
        category: 'Category',
        categoryEn: 'Category',
        categoryPh: 'e.g. Tech / Notes',
        categoryEnPh: 'e.g. Tech / Notes',
        editor: 'Tiptap Rich Text Editor',
        englishVersion: 'English Version',
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
        seoTitleEn: 'SEO Title',
        seoTitlePh: 'Fallback to title',
        seoTitleEnPh: 'Fallback to English title',
        seoDesc: 'SEO Description',
        seoDescEn: 'SEO Description',
        seoDescPh: 'Fallback to summary',
        seoDescEnPh: 'Fallback to English summary',
        seoKeywordsPh: 'blog, nextjs, frontend',
        seoKeywordsEnPh: 'blog, nextjs, frontend',
        uploadFail: 'Cover upload failed',
        saveFail: 'Save failed, please check your form',
        deleteConfirm: 'Are you sure you want to delete this post?',
        deleteFail: 'Delete failed',
        save: mode === 'create' ? 'Create Post' : 'Save Changes',
        saving: 'Saving...',
        remove: 'Delete Post',
      }
    : {
        zhTab: '中文',
        enTab: 'English',
        title: '标题',
        titleEn: '标题',
        titleEnPh: '用于 /en 页面显示',
        summary: '摘要',
        summaryEn: '摘要',
        content: '正文内容',
        contentEn: '正文内容',
        category: '分类',
        categoryEn: '分类',
        categoryPh: '例如：技术 / 随笔',
        categoryEnPh: 'e.g. Tech / Notes',
        editor: 'Tiptap 富文本编辑器',
        englishVersion: '英文版本',
        status: '状态',
        draft: '草稿',
        published: '已发布',
        archived: '已归档',
        publishedAt: '发布时间',
        coverUrl: '封面图地址',
        coverUpload: '上传封面图',
        uploading: '上传中...',
        uploadHint: '支持上传本地图片',
        tags: '标签',
        seoTitle: 'SEO 标题',
        seoTitleEn: 'SEO 标题',
        seoTitlePh: '留空时默认使用标题',
        seoTitleEnPh: '留空时默认使用英文标题',
        seoDesc: 'SEO 描述',
        seoDescEn: 'SEO 描述',
        seoDescPh: '留空时默认使用摘要',
        seoDescEnPh: '留空时默认使用英文摘要',
        seoKeywordsPh: '个人博客, Next.js, 前端',
        seoKeywordsEnPh: 'blog, nextjs, frontend',
        uploadFail: '封面上传失败',
        saveFail: '保存失败，请检查表单',
        deleteConfirm: '确认删除这篇文章吗？',
        deleteFail: '删除失败',
        save: mode === 'create' ? '创建文章' : '保存修改',
        saving: '保存中...',
        remove: '删除文章',
      };

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [activeLang, setActiveLang] = useState<'zh' | 'en'>(locale === 'en' ? 'en' : 'zh');

  const defaultValue: PostFormValue = useMemo(
    () => ({
      id: initialValue?.id,
      title: initialValue?.title || '',
      titleEn: initialValue?.titleEn || '',
      slug: initialValue?.slug || '',
      summary: initialValue?.summary || '',
      summaryEn: initialValue?.summaryEn || '',
      content: initialValue?.content || '<p></p>',
      contentEn: initialValue?.contentEn || '<p></p>',
      coverImage: initialValue?.coverImage || '',
      category: initialValue?.category || '',
      categoryEn: initialValue?.categoryEn || '',
      tags: initialValue?.tags || [],
      seoTitle: initialValue?.seoTitle || '',
      seoTitleEn: initialValue?.seoTitleEn || '',
      seoDescription: initialValue?.seoDescription || '',
      seoDescriptionEn: initialValue?.seoDescriptionEn || '',
      seoKeywords: initialValue?.seoKeywords || '',
      seoKeywordsEn: initialValue?.seoKeywordsEn || '',
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
        <div className="rounded-2xl border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="inline-flex rounded-xl border border-neutral-200 p-1 text-sm dark:border-neutral-700">
            <button
              type="button"
              onClick={() => setActiveLang('zh')}
              className={[
                'rounded-lg px-3 py-1.5 transition',
                activeLang === 'zh'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
              ].join(' ')}
            >
              {t.zhTab}
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('en')}
              className={[
                'rounded-lg px-3 py-1.5 transition',
                activeLang === 'en'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
              ].join(' ')}
            >
              {t.enTab}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="mb-2 block text-sm font-medium">{activeLang === 'zh' ? t.title : t.titleEn}</label>
          <input
            value={activeLang === 'zh' ? form.title : form.titleEn || ''}
            onChange={(e) => {
              if (activeLang === 'zh') {
                const title = e.target.value;
                update('title', title);
                if (!form.slug) update('slug', slugify(title));
                if (!form.seoTitle) update('seoTitle', title);
              } else {
                const titleEn = e.target.value;
                update('titleEn', titleEn);
                if (!form.seoTitleEn) update('seoTitleEn', titleEn);
              }
            }}
            placeholder={activeLang === 'zh' ? '' : t.titleEnPh}
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
            <label className="mb-2 block text-sm font-medium">{activeLang === 'zh' ? t.category : t.categoryEn}</label>
            <input
              value={activeLang === 'zh' ? form.category || '' : form.categoryEn || ''}
              onChange={(e) => update(activeLang === 'zh' ? 'category' : 'categoryEn', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
              placeholder={activeLang === 'zh' ? t.categoryPh : t.categoryEnPh}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="mb-2 block text-sm font-medium">{activeLang === 'zh' ? t.summary : t.summaryEn}</label>
          <textarea
            value={activeLang === 'zh' ? form.summary || '' : form.summaryEn || ''}
            onChange={(e) => {
              if (activeLang === 'zh') {
                update('summary', e.target.value);
                if (!form.seoDescription) update('seoDescription', e.target.value);
              } else {
                update('summaryEn', e.target.value);
                if (!form.seoDescriptionEn) update('seoDescriptionEn', e.target.value);
              }
            }}
            rows={4}
            className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
          />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="block text-sm font-medium">{activeLang === 'zh' ? t.content : t.contentEn}</label>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{activeLang === 'zh' ? t.editor : t.englishVersion}</span>
          </div>
          {activeLang === 'zh' ? (
            <RichTextEditor value={form.content} onChange={(value) => update('content', value)} />
          ) : (
            <RichTextEditor value={form.contentEn || '<p></p>'} onChange={(value) => update('contentEn', value)} />
          )}
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
            <label className="mb-2 block text-sm font-medium">{activeLang === 'zh' ? t.seoTitle : t.seoTitleEn}</label>
            <input
              value={activeLang === 'zh' ? form.seoTitle || '' : form.seoTitleEn || ''}
              onChange={(e) => update(activeLang === 'zh' ? 'seoTitle' : 'seoTitleEn', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
              placeholder={activeLang === 'zh' ? t.seoTitlePh : t.seoTitleEnPh}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">{activeLang === 'zh' ? t.seoDesc : t.seoDescEn}</label>
            <textarea
              value={activeLang === 'zh' ? form.seoDescription || '' : form.seoDescriptionEn || ''}
              onChange={(e) => update(activeLang === 'zh' ? 'seoDescription' : 'seoDescriptionEn', e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
              placeholder={activeLang === 'zh' ? t.seoDescPh : t.seoDescEnPh}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">{activeLang === 'zh' ? 'SEO Keywords' : 'SEO Keywords (EN)'}</label>
            <input
              value={activeLang === 'zh' ? form.seoKeywords || '' : form.seoKeywordsEn || ''}
              onChange={(e) => update(activeLang === 'zh' ? 'seoKeywords' : 'seoKeywordsEn', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
              placeholder={activeLang === 'zh' ? t.seoKeywordsPh : t.seoKeywordsEnPh}
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">{error}</div>
        ) : null}

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
