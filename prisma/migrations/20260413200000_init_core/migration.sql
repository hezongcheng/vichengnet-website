-- Create enum safely
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PostStatus') THEN
    CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
  END IF;
END$$;

-- Core tables
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'admin',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Post" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "summary" TEXT,
  "content" TEXT NOT NULL,
  "coverImage" TEXT,
  "category" TEXT,
  "tags" TEXT[],
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "seoKeywords" TEXT,
  "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ContentBlock" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "title" TEXT,
  "value" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'text',
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "VisitEvent" (
  "id" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "visitorId" TEXT NOT NULL,
  "sessionId" TEXT,
  "ip" TEXT,
  "country" TEXT,
  "city" TEXT,
  "referer" TEXT,
  "refererHost" TEXT,
  "userAgent" TEXT,
  "deviceType" TEXT,
  "browser" TEXT,
  "os" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VisitEvent_pkey" PRIMARY KEY ("id")
);

-- Unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Post_slug_key" ON "Post"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "ContentBlock_key_key" ON "ContentBlock"("key");

-- Normal indexes
CREATE INDEX IF NOT EXISTS "Post_status_publishedAt_idx" ON "Post"("status", "publishedAt");
CREATE INDEX IF NOT EXISTS "Post_slug_idx" ON "Post"("slug");
CREATE INDEX IF NOT EXISTS "Post_category_idx" ON "Post"("category");
CREATE INDEX IF NOT EXISTS "VisitEvent_path_createdAt_idx" ON "VisitEvent"("path", "createdAt");
CREATE INDEX IF NOT EXISTS "VisitEvent_visitorId_createdAt_idx" ON "VisitEvent"("visitorId", "createdAt");
CREATE INDEX IF NOT EXISTS "VisitEvent_refererHost_createdAt_idx" ON "VisitEvent"("refererHost", "createdAt");
CREATE INDEX IF NOT EXISTS "VisitEvent_ip_createdAt_idx" ON "VisitEvent"("ip", "createdAt");
