# Vichengnet Website

A content-first personal website built with Next.js 14, Prisma, PostgreSQL, and NextAuth.

## Tech Stack

- Next.js 14 (App Router, TypeScript)
- Prisma + PostgreSQL
- NextAuth (admin authentication)
- Tailwind CSS
- Tiptap (rich text editor)
- Giscus (comments)

## Main Features

- Public site:
- Home, Posts, Post detail, Categories, Tags, Search, Projects, About, Nav directory
- Chinese/English support with locale-aware routes
- Analytics:
- PV/UV tracking, referrer and visitor reports, top paths, trend charts
- Admin panel:
- Dashboard analytics
- Post management (create/edit/delete)
- Project management
- Directory management
- Settings management
- SEO and feeds:
- Dynamic sitemap (`/sitemap.xml`)
- RSS (`/rss.xml`)
- robots (`/robots.txt`)

## Locale Routing

Current route strategy follows a `diygod.cc` style:

- Chinese (default): no prefix  
  Example: `/posts/giscus-key-getting-guide`
- English: `/en` prefix  
  Example: `/en/posts/giscus-key-getting-guide`
- Legacy Chinese prefix `/zh/*` is redirected to no-prefix paths.

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Configure environment

```bash
cp .env.example .env
```

3. Generate Prisma client and run migrations

```bash
npm run prisma:generate
npx prisma migrate dev --name init
```

4. (Optional) Seed initial data

```bash
npm run prisma:seed
```

5. Run dev server

```bash
npm run dev
```

Open:

- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - create and run migration (dev)
- `npm run prisma:seed` - seed database

## Required Environment Variables

See `.env.example` and ensure at least:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (recommended in production)

## Deployment Notes (Vercel)

- Ensure Prisma client is generated in build pipeline.
- Keep `prisma/schema.prisma` `binaryTargets` compatible with Vercel runtime.
- Add all required environment variables in Vercel Project Settings.
- After deploy, verify:
- `/sitemap.xml`
- `/rss.xml`
- `/en/posts/...` and `/posts/...` article pages

## Frontend Footer Extras

- Bottom-right floating GitHub button links to:
- `https://github.com/hezongcheng/vichengnet-website`
- ICP record in footer links to:
- `https://beian.miit.gov.cn/`
