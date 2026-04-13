-- AlterTable
ALTER TABLE "ContentBlock"
ADD COLUMN IF NOT EXISTS "locale" TEXT NOT NULL DEFAULT 'zh';

-- Backfill
UPDATE "ContentBlock" SET "locale" = 'zh' WHERE "locale" IS NULL;

-- Rebuild unique constraints
DROP INDEX IF EXISTS "ContentBlock_key_key";
CREATE UNIQUE INDEX IF NOT EXISTS "ContentBlock_key_locale_key" ON "ContentBlock"("key", "locale");
CREATE INDEX IF NOT EXISTS "ContentBlock_key_idx" ON "ContentBlock"("key");

-- AlterTable
ALTER TABLE "NavCategory"
ADD COLUMN IF NOT EXISTS "labelZh" TEXT,
ADD COLUMN IF NOT EXISTS "labelEn" TEXT;

-- Backfill existing values
UPDATE "NavCategory"
SET "labelZh" = COALESCE("labelZh", "label"),
    "labelEn" = COALESCE("labelEn", "label");

-- AlterTable
ALTER TABLE "NavSite"
ADD COLUMN IF NOT EXISTS "nameZh" TEXT,
ADD COLUMN IF NOT EXISTS "nameEn" TEXT,
ADD COLUMN IF NOT EXISTS "descriptionZh" TEXT,
ADD COLUMN IF NOT EXISTS "descriptionEn" TEXT;

-- Backfill existing values
UPDATE "NavSite"
SET "nameZh" = COALESCE("nameZh", "name"),
    "nameEn" = COALESCE("nameEn", "name"),
    "descriptionZh" = COALESCE("descriptionZh", "description"),
    "descriptionEn" = COALESCE("descriptionEn", "description");
