import Container from '@/components/site/Container';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';

export default function ProjectsPage() {
  const projects = [
    { name: '个人博客', description: '记录文章、笔记和长期输出。' },
    { name: '项目归档', description: '整理自己的作品、实验和可复用经验。' },
    { name: '建站日志', description: '记录站点从设计到运营的过程。' },
  ];

  return (
    <main>
      <SiteHeader />
      <Container>
        <section className="border-b border-neutral-200/80 py-12 dark:border-neutral-800/80 md:py-16">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">项目</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-400">
            我正在做的一些事情，以及它们缓慢推进的过程。
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
