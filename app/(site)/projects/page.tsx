import type { Metadata } from 'next';
import Container from '@/components/site/Container';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';

export const metadata: Metadata = {
  title: '项目',
  description: '查看维成小站的实践项目，包括博客系统、工具实验与建站过程记录。',
  keywords: ['项目', '开源项目', '建站项目', '技术实践'],
  alternates: {
    canonical: '/zh/projects',
    languages: {
      'zh-CN': '/zh/projects',
      'en-US': '/en/projects',
    },
  },
};

export default function ProjectsPage() {
  const projects = [
    { name: '个人博客系统', description: '基于 Next.js 与 Prisma 构建，持续迭代内容发布与后台管理能力。' },
    { name: '工具导航体系', description: '围绕开发与效率工具构建结构化导航，支持分类管理与多语言展示。' },
    { name: '建站优化日志', description: '记录从性能优化、SEO 到内容策略的长期改进过程。' },
  ];

  return (
    <main>
      <SiteHeader />
      <Container>
        <section className="border-b border-neutral-200/80 py-12 dark:border-neutral-800/80 md:py-16">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">项目</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-400">
            这里沉淀我正在进行的产品与技术实践，覆盖建站、内容系统与工具化探索。
          </p>
        </section>

        <section className="py-8 md:py-10">
          <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
            {projects.map((project) => (
              <article key={project.name} className="py-5 md:py-6">
                <h2 className="text-xl font-medium tracking-tight md:text-2xl">{project.name}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-8 text-neutral-600 dark:text-neutral-400 md:text-base">
                  {project.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </Container>
      <SiteFooter />
    </main>
  );
}
