-- CreateTable
CREATE TABLE IF NOT EXISTS "NavCategory" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "NavSite" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavSite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "NavCategory_key_key" ON "NavCategory"("key");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "NavCategory_sortOrder_idx" ON "NavCategory"("sortOrder");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "NavSite_categoryId_sortOrder_idx" ON "NavSite"("categoryId", "sortOrder");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "NavSite_url_idx" ON "NavSite"("url");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'NavSite_categoryId_fkey'
  ) THEN
    ALTER TABLE "NavSite"
      ADD CONSTRAINT "NavSite_categoryId_fkey"
      FOREIGN KEY ("categoryId") REFERENCES "NavCategory"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;
