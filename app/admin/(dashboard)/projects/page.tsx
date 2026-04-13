import ProjectManager from '@/components/admin/ProjectManager';
import { findContentBlock } from '@/lib/content-store';
import { defaultLocale } from '@/lib/i18n/config';
import { getAdminLocale } from '@/lib/i18n/admin';
import { stringifyProjectItems, parseProjectItems } from '@/lib/projects';

export default async function AdminProjectsPage() {
  const locale = getAdminLocale();
  const isEn = locale === 'en';
  const block = await findContentBlock('projects.items', defaultLocale);
  const initialValue = block?.value || stringifyProjectItems(parseProjectItems(''));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{isEn ? 'Project Management' : '项目管理'}</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {isEn ? 'Manage items shown on the Projects page for both Chinese and English.' : '统一维护前台 Projects 页展示的中英文项目列表。'}
        </p>
      </div>
      <ProjectManager initialValue={initialValue} />
    </div>
  );
}
