import PostEditorForm from '@/components/admin/PostEditorForm';
import { getAdminLocale } from '@/lib/i18n/admin';

export default function AdminNewPostPage() {
  const locale = getAdminLocale();
  const isEn = locale === 'en';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{isEn ? 'Create Post' : '新建文章'}</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {isEn ? 'Create a brand new post and publish when ready.' : '创建一篇新的站点文章，并在准备好后发布。'}
        </p>
      </div>

      <PostEditorForm mode="create" locale={locale} />
    </div>
  );
}
