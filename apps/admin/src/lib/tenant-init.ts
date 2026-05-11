/**
 * Schéma SQL des tables tenant — exécuté soit explicitement via /api/admin/init-tenant,
 * soit automatiquement par le wizard de création de site si les tables manquent.
 *
 * Toutes les statements sont CREATE TABLE IF NOT EXISTS, donc idempotent et safe à rejouer.
 */

export const TENANT_TABLES: { name: string; sql: string }[] = [
  { name: 'SitePage', sql: `
    CREATE TABLE IF NOT EXISTS "SitePage" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "siteId" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "meta" JSONB,
      "blocks" JSONB NOT NULL,
      "visible" BOOLEAN NOT NULL DEFAULT true,
      "isHome" BOOLEAN NOT NULL DEFAULT false,
      "noIndex" BOOLEAN NOT NULL DEFAULT false,
      "canonical" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "SitePage_siteId_slug_key" ON "SitePage"("siteId", "slug");
    CREATE INDEX IF NOT EXISTS "SitePage_siteId_visible_idx" ON "SitePage"("siteId", "visible");
  ` },
  { name: 'Lead', sql: `
    CREATE TABLE IF NOT EXISTS "Lead" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT UNIQUE,
      "firstName" TEXT, "lastName" TEXT, "phone" TEXT, "company" TEXT,
      "jobTitle" TEXT, "city" TEXT, "country" TEXT,
      "source" TEXT NOT NULL DEFAULT 'manual', "sourceDetail" TEXT,
      "status" TEXT NOT NULL DEFAULT 'new',
      "score" INTEGER NOT NULL DEFAULT 0,
      "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "segments" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "notes" TEXT, "customFields" JSONB,
      "lastContactedAt" TIMESTAMP(3),
      "contactCount" INTEGER NOT NULL DEFAULT 0,
      "newsletterOptIn" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  ` },
  { name: 'FormConfig', sql: `
    CREATE TABLE IF NOT EXISTS "FormConfig" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "slug" TEXT NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "fields" JSONB NOT NULL,
      "notifyEmail" TEXT,
      "active" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  ` },
  { name: 'Article', sql: `
    CREATE TABLE IF NOT EXISTS "Article" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "slug" TEXT NOT NULL UNIQUE,
      "title" TEXT NOT NULL,
      "excerpt" TEXT, "bodyHtml" TEXT, "coverImage" TEXT,
      "status" TEXT NOT NULL DEFAULT 'draft',
      "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "publishedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  ` },
  { name: 'Newsletter', sql: `
    CREATE TABLE IF NOT EXISTS "Newsletter" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "subject" TEXT NOT NULL, "bodyHtml" TEXT,
      "status" TEXT NOT NULL DEFAULT 'draft',
      "scheduledAt" TIMESTAMP(3), "sentAt" TIMESTAMP(3),
      "opensCount" INTEGER NOT NULL DEFAULT 0, "clicksCount" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  ` },
  { name: 'Task', sql: `
    CREATE TABLE IF NOT EXISTS "Task" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL, "description" TEXT,
      "status" TEXT NOT NULL DEFAULT 'todo',
      "priority" TEXT NOT NULL DEFAULT 'normal',
      "assignee" TEXT, "dueDate" TIMESTAMP(3),
      "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "position" INTEGER NOT NULL DEFAULT 0, "parentId" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  ` },
  { name: 'ForumThread', sql: `
    CREATE TABLE IF NOT EXISTS "ForumThread" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "categoryId" TEXT, "title" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE,
      "body" TEXT, "authorEmail" TEXT, "authorName" TEXT,
      "pinned" BOOLEAN NOT NULL DEFAULT false,
      "locked" BOOLEAN NOT NULL DEFAULT false,
      "views" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  ` },
  { name: 'ForumPost', sql: `
    CREATE TABLE IF NOT EXISTS "ForumPost" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "threadId" TEXT NOT NULL,
      "body" TEXT NOT NULL,
      "authorEmail" TEXT, "authorName" TEXT, "parentId" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  ` },
  { name: 'Product', sql: `
    CREATE TABLE IF NOT EXISTS "Product" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "slug" TEXT NOT NULL UNIQUE, "name" TEXT NOT NULL, "description" TEXT,
      "priceCents" INTEGER NOT NULL, "currency" TEXT NOT NULL DEFAULT 'EUR',
      "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "inventory" INTEGER NOT NULL DEFAULT 0,
      "category" TEXT, "variants" JSONB,
      "active" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  ` },
  { name: 'SitemapEntry', sql: `
    CREATE TABLE IF NOT EXISTS "SitemapEntry" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "path" TEXT NOT NULL UNIQUE, "label" TEXT NOT NULL,
      "parentId" TEXT, "position" INTEGER NOT NULL DEFAULT 0,
      "visibleNav" BOOLEAN NOT NULL DEFAULT true,
      "visibleSEO" BOOLEAN NOT NULL DEFAULT true,
      "changefreq" TEXT, "priority" DOUBLE PRECISION,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  ` },
];

/**
 * Crée toutes les tables tenant (idempotent). Retourne un log par table.
 */
export async function ensureTenantTables(db: any): Promise<{ name: string; ok: boolean; detail?: string }[]> {
  const log: { name: string; ok: boolean; detail?: string }[] = [];
  for (const t of TENANT_TABLES) {
    try {
      for (const stmt of t.sql.split(';').map((s) => s.trim()).filter(Boolean)) {
        await db.$executeRawUnsafe(stmt);
      }
      log.push({ name: t.name, ok: true });
    } catch (e: any) {
      log.push({ name: t.name, ok: false, detail: e?.message?.slice(0, 200) });
    }
  }
  return log;
}
