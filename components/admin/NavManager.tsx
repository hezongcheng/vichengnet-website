'use client';

import { useMemo, useState } from 'react';

type NavSiteRow = {
  id: string;
  categoryId: string;
  name: string;
  nameZh: string | null;
  nameEn: string | null;
  url: string;
  description: string | null;
  descriptionZh: string | null;
  descriptionEn: string | null;
  tags: string[];
  sortOrder: number;
};

type NavCategoryRow = {
  id: string;
  key: string;
  label: string;
  labelZh: string | null;
  labelEn: string | null;
  sortOrder: number;
  sites: NavSiteRow[];
};

type SiteDraft = {
  nameZh: string;
  nameEn: string;
  url: string;
  descriptionZh: string;
  descriptionEn: string;
  tags: string;
};

const emptySiteDraft: SiteDraft = {
  nameZh: '',
  nameEn: '',
  url: '',
  descriptionZh: '',
  descriptionEn: '',
  tags: '',
};

export default function NavManager({ initialCategories }: { initialCategories: NavCategoryRow[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [categoryDraft, setCategoryDraft] = useState({ labelZh: '', labelEn: '', key: '' });
  const [categoryForms, setCategoryForms] = useState<Record<string, { labelZh: string; labelEn: string; key: string }>>(
    () =>
      Object.fromEntries(
        initialCategories.map((category) => [
          category.id,
          {
            labelZh: category.labelZh || category.label,
            labelEn: category.labelEn || category.label,
            key: category.key,
          },
        ])
      )
  );
  const [siteCreateForms, setSiteCreateForms] = useState<Record<string, SiteDraft>>({});
  const [siteEditForms, setSiteEditForms] = useState<Record<string, SiteDraft>>(
    () =>
      Object.fromEntries(
        initialCategories.flatMap((category) =>
          category.sites.map((site) => [
            site.id,
            {
              nameZh: site.nameZh || site.name,
              nameEn: site.nameEn || site.name,
              url: site.url,
              descriptionZh: site.descriptionZh || site.description || '',
              descriptionEn: site.descriptionEn || site.description || '',
              tags: site.tags.join(', '),
            },
          ])
        )
      )
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const totalSites = useMemo(
    () => categories.reduce((sum, category) => sum + category.sites.length, 0),
    [categories]
  );

  function setSiteCreateDraft(categoryId: string, next: Partial<SiteDraft>) {
    setSiteCreateForms((prev) => ({
      ...prev,
      [categoryId]: { ...(prev[categoryId] || emptySiteDraft), ...next },
    }));
  }

  function setSiteEditDraft(siteId: string, next: Partial<SiteDraft>) {
    setSiteEditForms((prev) => ({
      ...prev,
      [siteId]: { ...(prev[siteId] || emptySiteDraft), ...next },
    }));
  }

  function normalizeTags(raw: string) {
    return raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function refreshForms(nextCategories: NavCategoryRow[]) {
    setCategoryForms(
      Object.fromEntries(
        nextCategories.map((category) => [
          category.id,
          {
            labelZh: category.labelZh || category.label,
            labelEn: category.labelEn || category.label,
            key: category.key,
          },
        ])
      )
    );

    setSiteEditForms(
      Object.fromEntries(
        nextCategories.flatMap((category) =>
          category.sites.map((site) => [
            site.id,
            {
              nameZh: site.nameZh || site.name,
              nameEn: site.nameEn || site.name,
              url: site.url,
              descriptionZh: site.descriptionZh || site.description || '',
              descriptionEn: site.descriptionEn || site.description || '',
              tags: site.tags.join(', '),
            },
          ])
        )
      )
    );
  }

  async function reloadCategories() {
    const res = await fetch('/api/nav/categories', { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || '加载导航数据失败');
    }
    setCategories(data);
    refreshForms(data);
  }

  async function runMutation(task: () => Promise<void>, successText: string) {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await task();
      await reloadCategories();
      setMessage(successText);
    } catch (e) {
      setError(e instanceof Error ? e.message : '操作失败');
    } finally {
      setSaving(false);
    }
  }

  async function requestJson(url: string, method: string, body?: unknown) {
    const res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || `请求失败: ${method} ${url}`);
    }
    return data;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-lg font-medium">新增分类</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            value={categoryDraft.labelZh}
            onChange={(e) => setCategoryDraft((prev) => ({ ...prev, labelZh: e.target.value }))}
            placeholder="中文分类名，例如：开发工具"
            className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
          />
          <input
            value={categoryDraft.labelEn}
            onChange={(e) => setCategoryDraft((prev) => ({ ...prev, labelEn: e.target.value }))}
            placeholder="English category, e.g. Dev Tools"
            className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
          />
          <input
            value={categoryDraft.key}
            onChange={(e) => setCategoryDraft((prev) => ({ ...prev, key: e.target.value }))}
            placeholder="分类标识，可留空自动生成"
            className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
          />
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() =>
            runMutation(async () => {
              await requestJson('/api/nav/categories', 'POST', {
                labelZh: categoryDraft.labelZh,
                labelEn: categoryDraft.labelEn,
                key: categoryDraft.key || undefined,
              });
              setCategoryDraft({ labelZh: '', labelEn: '', key: '' });
            }, '分类已创建')
          }
          className="mt-4 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
        >
          创建分类
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
        <span>分类 {categories.length} 个</span>
        <span>站点 {totalSites} 个</span>
      </div>

      <div className="space-y-4">
        {categories.map((category, index) => {
          const form = categoryForms[category.id] || {
            labelZh: category.labelZh || category.label,
            labelEn: category.labelEn || category.label,
            key: category.key,
          };
          const createForm = siteCreateForms[category.id] || emptySiteDraft;

          return (
            <section key={category.id} className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="grid gap-2 md:grid-cols-[1fr_1fr_220px_auto_auto_auto_auto]">
                <input
                  value={form.labelZh}
                  onChange={(e) =>
                    setCategoryForms((prev) => ({
                      ...prev,
                      [category.id]: { ...form, labelZh: e.target.value },
                    }))
                  }
                  placeholder="中文分类名"
                  className="rounded-xl border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
                />
                <input
                  value={form.labelEn}
                  onChange={(e) =>
                    setCategoryForms((prev) => ({
                      ...prev,
                      [category.id]: { ...form, labelEn: e.target.value },
                    }))
                  }
                  placeholder="English category name"
                  className="rounded-xl border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
                />
                <input
                  value={form.key}
                  onChange={(e) =>
                    setCategoryForms((prev) => ({
                      ...prev,
                      [category.id]: { ...form, key: e.target.value },
                    }))
                  }
                  className="rounded-xl border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
                />
                <button
                  type="button"
                  disabled={saving || index === 0}
                  onClick={() =>
                    runMutation(async () => {
                      const ids = categories.map((item) => item.id);
                      [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
                      await requestJson('/api/nav/categories', 'PATCH', { ids });
                    }, '分类排序已更新')
                  }
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-xs disabled:opacity-50 dark:border-neutral-700"
                >
                  上移
                </button>
                <button
                  type="button"
                  disabled={saving || index === categories.length - 1}
                  onClick={() =>
                    runMutation(async () => {
                      const ids = categories.map((item) => item.id);
                      [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
                      await requestJson('/api/nav/categories', 'PATCH', { ids });
                    }, '分类排序已更新')
                  }
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-xs disabled:opacity-50 dark:border-neutral-700"
                >
                  下移
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    runMutation(
                      async () => {
                        await requestJson('/api/nav/categories', 'PUT', {
                          id: category.id,
                          labelZh: form.labelZh,
                          labelEn: form.labelEn,
                          key: form.key,
                        });
                      },
                      '分类已更新'
                    )
                  }
                  className="rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
                >
                  保存
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    const confirmed = window.confirm('删除分类会同时删除其下所有站点，确认继续吗？');
                    if (!confirmed) return;
                    runMutation(
                      async () => {
                        await requestJson(`/api/nav/categories/${category.id}`, 'DELETE');
                      },
                      '分类已删除'
                    );
                  }}
                  className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 disabled:opacity-50 dark:border-red-900/50 dark:text-red-300"
                >
                  删除
                </button>
              </div>

              <div className="mt-5 rounded-xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
                <div className="mb-3 text-sm font-medium">新增站点</div>
                <div className="grid gap-3 md:grid-cols-3">
                  <input
                    value={createForm.nameZh}
                    onChange={(e) => setSiteCreateDraft(category.id, { nameZh: e.target.value })}
                    placeholder="中文站点名"
                    className="rounded-xl border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
                  />
                  <input
                    value={createForm.nameEn}
                    onChange={(e) => setSiteCreateDraft(category.id, { nameEn: e.target.value })}
                    placeholder="English site name"
                    className="rounded-xl border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
                  />
                  <input
                    value={createForm.url}
                    onChange={(e) => setSiteCreateDraft(category.id, { url: e.target.value })}
                    placeholder="https://example.com"
                    className="rounded-xl border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
                  />
                  <input
                    value={createForm.descriptionZh}
                    onChange={(e) => setSiteCreateDraft(category.id, { descriptionZh: e.target.value })}
                    placeholder="中文简介"
                    className="rounded-xl border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
                  />
                  <input
                    value={createForm.descriptionEn}
                    onChange={(e) => setSiteCreateDraft(category.id, { descriptionEn: e.target.value })}
                    placeholder="English description"
                    className="rounded-xl border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
                  />
                  <input
                    value={createForm.tags}
                    onChange={(e) => setSiteCreateDraft(category.id, { tags: e.target.value })}
                    placeholder="标签，用逗号分隔"
                    className="rounded-xl border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-200"
                  />
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    runMutation(async () => {
                      await requestJson('/api/nav/sites', 'POST', {
                        categoryId: category.id,
                        nameZh: createForm.nameZh,
                        nameEn: createForm.nameEn,
                        url: createForm.url,
                        descriptionZh: createForm.descriptionZh,
                        descriptionEn: createForm.descriptionEn,
                        tags: normalizeTags(createForm.tags),
                      });
                      setSiteCreateForms((prev) => ({ ...prev, [category.id]: emptySiteDraft }));
                    }, '站点已创建')
                  }
                  className="mt-3 rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
                >
                  添加站点
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {category.sites.map((site, siteIndex) => {
                  const siteForm = siteEditForms[site.id] || {
                    nameZh: site.nameZh || site.name,
                    nameEn: site.nameEn || site.name,
                    url: site.url,
                    descriptionZh: site.descriptionZh || site.description || '',
                    descriptionEn: site.descriptionEn || site.description || '',
                    tags: site.tags.join(', '),
                  };
                  return (
                    <div key={site.id} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
                      <div className="grid gap-2 md:grid-cols-3">
                        <input
                          value={siteForm.nameZh}
                          onChange={(e) => setSiteEditDraft(site.id, { nameZh: e.target.value })}
                          placeholder="中文站点名"
                          className="rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-200"
                        />
                        <input
                          value={siteForm.nameEn}
                          onChange={(e) => setSiteEditDraft(site.id, { nameEn: e.target.value })}
                          placeholder="English site name"
                          className="rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-200"
                        />
                        <input
                          value={siteForm.url}
                          onChange={(e) => setSiteEditDraft(site.id, { url: e.target.value })}
                          className="rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-200"
                        />
                        <input
                          value={siteForm.descriptionZh}
                          onChange={(e) => setSiteEditDraft(site.id, { descriptionZh: e.target.value })}
                          placeholder="中文简介"
                          className="rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-200"
                        />
                        <input
                          value={siteForm.descriptionEn}
                          onChange={(e) => setSiteEditDraft(site.id, { descriptionEn: e.target.value })}
                          placeholder="English description"
                          className="rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-200"
                        />
                        <input
                          value={siteForm.tags}
                          onChange={(e) => setSiteEditDraft(site.id, { tags: e.target.value })}
                          placeholder="标签"
                          className="rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-200"
                        />
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={saving || siteIndex === 0}
                          onClick={() =>
                            runMutation(async () => {
                              const ids = category.sites.map((item) => item.id);
                              [ids[siteIndex - 1], ids[siteIndex]] = [ids[siteIndex], ids[siteIndex - 1]];
                              await requestJson('/api/nav/sites', 'PATCH', {
                                categoryId: category.id,
                                ids,
                              });
                            }, '站点排序已更新')
                          }
                          className="rounded-lg border border-neutral-200 px-3 py-2 text-xs disabled:opacity-50 dark:border-neutral-700"
                        >
                          上移
                        </button>
                        <button
                          type="button"
                          disabled={saving || siteIndex === category.sites.length - 1}
                          onClick={() =>
                            runMutation(async () => {
                              const ids = category.sites.map((item) => item.id);
                              [ids[siteIndex], ids[siteIndex + 1]] = [ids[siteIndex + 1], ids[siteIndex]];
                              await requestJson('/api/nav/sites', 'PATCH', {
                                categoryId: category.id,
                                ids,
                              });
                            }, '站点排序已更新')
                          }
                          className="rounded-lg border border-neutral-200 px-3 py-2 text-xs disabled:opacity-50 dark:border-neutral-700"
                        >
                          下移
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            runMutation(
                              async () => {
                                await requestJson('/api/nav/sites', 'PUT', {
                                  id: site.id,
                                  categoryId: category.id,
                                  nameZh: siteForm.nameZh,
                                  nameEn: siteForm.nameEn,
                                  url: siteForm.url,
                                  descriptionZh: siteForm.descriptionZh,
                                  descriptionEn: siteForm.descriptionEn,
                                  tags: normalizeTags(siteForm.tags),
                                });
                              },
                              '站点已更新'
                            )
                          }
                          className="rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
                        >
                          保存
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => {
                            const confirmed = window.confirm('确认删除该站点吗？');
                            if (!confirmed) return;
                            runMutation(
                              async () => {
                                await requestJson(`/api/nav/sites/${site.id}`, 'DELETE');
                              },
                              '站点已删除'
                            );
                          }}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 disabled:opacity-50 dark:border-red-900/50 dark:text-red-300"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  );
                })}
                {!category.sites.length ? (
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">该分类下还没有站点。</div>
                ) : null}
              </div>
            </section>
          );
        })}
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
    </div>
  );
}
