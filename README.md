# 维成小站

一个基于 Next.js 14 + Prisma + PostgreSQL + NextAuth 的个人网站与后台管理系统。

## 功能

- 前台站点：首页、文章、标签、分类、搜索、关于页
- 后台管理：登录、仪表盘、文章管理、内容管理、SEO、统计
- 访问统计：PV、UV、来源、IP
- 富文本：Tiptap 编辑器
- 评论：Giscus
- RSS / Sitemap / Robots
- 暗色模式、阅读进度条、阅读时长

## 快速开始

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

访问：

- 前台：http://localhost:3000
- Sitemap：http://localhost:3000/sitemap.xml
- 后台：http://localhost:3000/admin

## 提示

- Giscus 需要你自己填入 `components/site/CommentsGiscus.tsx` 中的仓库配置
- `/api/upload` 默认写入 `public/uploads`，适合本地开发；生产环境建议切对象存储
