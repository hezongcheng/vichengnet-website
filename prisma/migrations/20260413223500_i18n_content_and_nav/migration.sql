-- AlterTable
ALTER TABLE "ContentBlock"
ADD COLUMN "locale" TEXT NOT NULL DEFAULT 'zh';

-- Backfill
UPDATE "ContentBlock" SET "locale" = 'zh' WHERE "locale" IS NULL;

-- Rebuild unique constraints
DROP INDEX IF EXISTS "ContentBlock_key_key";
CREATE UNIQUE INDEX "ContentBlock_key_locale_key" ON "ContentBlock"("key", "locale");
CREATE INDEX "ContentBlock_key_idx" ON "ContentBlock"("key");

-- AlterTable
ALTER TABLE "NavCategory"
ADD COLUMN "labelZh" TEXT,
ADD COLUMN "labelEn" TEXT;

-- Backfill existing values
UPDATE "NavCategory"
SET "labelZh" = COALESCE("labelZh", "label"),
    "labelEn" = COALESCE("labelEn", "label");

-- AlterTable
ALTER TABLE "NavSite"
ADD COLUMN "nameZh" TEXT,
ADD COLUMN "nameEn" TEXT,
ADD COLUMN "descriptionZh" TEXT,
ADD COLUMN "descriptionEn" TEXT;

-- Backfill existing values
UPDATE "NavSite"
SET "nameZh" = COALESCE("nameZh", "name"),
    "nameEn" = COALESCE("nameEn", "name"),
    "descriptionZh" = COALESCE("descriptionZh", "description"),
    "descriptionEn" = COALESCE("descriptionEn", "description");
