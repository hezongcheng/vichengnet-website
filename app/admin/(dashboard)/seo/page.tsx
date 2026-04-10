import { prisma } from '@/lib/prisma';
import ContentEditorForm from '@/components/admin/ContentEditorForm';

export default async function AdminSeoPage() {
  const titleBlock = await prisma.contentBlock.findUnique({ where: { key: 'seo.default.title' } });
  const descBlock = await prisma.contentBlock.findUnique({ where: { key: 'seo.default.description' } });

  return (
    <div className="space-y-8">
      <ContentEditorForm
        contentKey="seo.default.title"
        title="SEO 默认标题"
        description="用于全站默认 title"
        initialTitle={titleBlock?.title || '默认标题'}
        initialValue={titleBlock?.value || '维成小站'}
        type={titleBlock?.type || 'text'}
      />

      <ContentEditorForm
        contentKey="seo.default.description"
        title="SEO 默认描述"
        description="用于全站默认 description"
        initialTitle={descBlock?.title || '默认描述'}
        initialValue={descBlock?.value || '一个简洁、安静、内容优先的个人站点。'}
        type={descBlock?.type || 'text'}
      />
    </div>
  );
}
