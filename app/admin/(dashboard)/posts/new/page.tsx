import PostEditorForm from '@/components/admin/PostEditorForm';

export default function AdminNewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">新建文章</h2>
        <p className="mt-1 text-sm text-neutral-500">创建一篇新的站点文章</p>
      </div>

      <PostEditorForm mode="create" />
    </div>
  );
}
