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
  { name: 'Order', sql: `
    CREATE TABLE IF NOT EXISTS "Order" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "externalId" TEXT,
      "email" TEXT NOT NULL,
      "firstName" TEXT, "lastName" TEXT, "phone" TEXT,
      "shipAddress" TEXT, "shipCity" TEXT, "shipPostal" TEXT, "shipCountry" TEXT,
      "subtotalCents" INTEGER NOT NULL DEFAULT 0,
      "shippingCents" INTEGER NOT NULL DEFAULT 0,
      "taxCents" INTEGER NOT NULL DEFAULT 0,
      "totalCents" INTEGER NOT NULL,
      "currency" TEXT NOT NULL DEFAULT 'EUR',
      "status" TEXT NOT NULL DEFAULT 'pending',
      "items" JSONB NOT NULL DEFAULT '[]'::jsonb,
      "trackingNumber" TEXT, "trackingUrl" TEXT, "carrier" TEXT,
      "shippedAt" TIMESTAMP(3), "deliveredAt" TIMESTAMP(3),
      "refundedCents" INTEGER NOT NULL DEFAULT 0,
      "refundedAt" TIMESTAMP(3),
      "dropshipProvider" TEXT, "dropshipOrderId" TEXT, "dropshipStatus" TEXT,
      "trackToken" TEXT NOT NULL,
      "notes" TEXT, "metadata" JSONB,
      "stripeSessionId" TEXT,
      "shippingAddress" JSONB, "billingAddress" JSONB,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "Order_trackToken_key" ON "Order"("trackToken");
    CREATE UNIQUE INDEX IF NOT EXISTS "Order_stripeSessionId_key" ON "Order"("stripeSessionId");
    CREATE INDEX IF NOT EXISTS "Order_status_createdAt_idx" ON "Order"("status", "createdAt");
    CREATE INDEX IF NOT EXISTS "Order_email_idx" ON "Order"("email");
  ` },
  { name: 'OrderItem', sql: `
    CREATE TABLE IF NOT EXISTS "OrderItem" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "orderId" TEXT NOT NULL,
      "productId" TEXT NOT NULL,
      "quantity" INTEGER NOT NULL,
      "priceCents" INTEGER NOT NULL,
      "variant" JSONB
    );
    CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");
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
  { name: 'Event', sql: `
    CREATE TABLE IF NOT EXISTS "Event" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "slug" TEXT NOT NULL UNIQUE,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "startsAt" TIMESTAMP(3) NOT NULL,
      "endsAt" TIMESTAMP(3),
      "location" TEXT,
      "lat" DOUBLE PRECISION,
      "lng" DOUBLE PRECISION,
      "coverImage" TEXT,
      "category" TEXT,
      "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "externalUrl" TEXT,
      "published" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "Event_startsAt_idx" ON "Event"("startsAt");
    CREATE INDEX IF NOT EXISTS "Event_category_idx" ON "Event"("category");
  ` },
  { name: 'Coupon', sql: `
    CREATE TABLE IF NOT EXISTS "Coupon" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "code" TEXT NOT NULL UNIQUE,
      "type" TEXT NOT NULL DEFAULT 'percent',
      "value" INTEGER NOT NULL DEFAULT 0,
      "currency" TEXT NOT NULL DEFAULT 'EUR',
      "minCents" INTEGER,
      "maxUses" INTEGER,
      "usedCount" INTEGER NOT NULL DEFAULT 0,
      "validFrom" TIMESTAMP(3),
      "validUntil" TIMESTAMP(3),
      "active" BOOLEAN NOT NULL DEFAULT true,
      "applicableProductIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "notes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "Coupon_active_idx" ON "Coupon"("active");
  ` },
  { name: 'Testimonial', sql: `
    CREATE TABLE IF NOT EXISTS "Testimonial" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "authorName" TEXT NOT NULL,
      "authorTitle" TEXT,
      "authorAvatar" TEXT,
      "videoUrl" TEXT,
      "posterImage" TEXT,
      "quote" TEXT,
      "rating" INTEGER,
      "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "published" BOOLEAN NOT NULL DEFAULT true,
      "position" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "Testimonial_published_position_idx" ON "Testimonial"("published", "position");
  ` },
  { name: 'YoutubeVideo', sql: `
    CREATE TABLE IF NOT EXISTS "YoutubeVideo" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "videoId" TEXT NOT NULL UNIQUE,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "thumbnail" TEXT,
      "channel" TEXT,
      "publishedAt" TIMESTAMP(3),
      "category" TEXT,
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "position" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "YoutubeVideo_position_idx" ON "YoutubeVideo"("position");
  ` },
  { name: 'Banner', sql: `
    CREATE TABLE IF NOT EXISTS "Banner" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "image" TEXT,
      "link" TEXT,
      "ctaLabel" TEXT,
      "position" TEXT NOT NULL DEFAULT 'hero',
      "priority" INTEGER NOT NULL DEFAULT 0,
      "startsAt" TIMESTAMP(3),
      "endsAt" TIMESTAMP(3),
      "active" BOOLEAN NOT NULL DEFAULT true,
      "targetPages" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "Banner_active_position_idx" ON "Banner"("active", "position");
  ` },
  { name: 'MapLocation', sql: `
    CREATE TABLE IF NOT EXISTS "MapLocation" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "type" TEXT,
      "address" TEXT,
      "lat" DOUBLE PRECISION NOT NULL,
      "lng" DOUBLE PRECISION NOT NULL,
      "country" TEXT,
      "city" TEXT,
      "description" TEXT,
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "openingHours" JSONB,
      "contact" JSONB,
      "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "MapLocation_type_idx" ON "MapLocation"("type");
    CREATE INDEX IF NOT EXISTS "MapLocation_country_city_idx" ON "MapLocation"("country", "city");
  ` },
  { name: 'ModerationItem', sql: `
    CREATE TABLE IF NOT EXISTS "ModerationItem" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "type" TEXT NOT NULL,
      "targetId" TEXT,
      "content" TEXT,
      "authorName" TEXT,
      "authorEmail" TEXT,
      "status" TEXT NOT NULL DEFAULT 'pending',
      "aiScore" DOUBLE PRECISION,
      "aiLabels" JSONB,
      "decidedBy" TEXT,
      "decidedAt" TIMESTAMP(3),
      "reason" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "ModerationItem_status_createdAt_idx" ON "ModerationItem"("status", "createdAt");
    CREATE INDEX IF NOT EXISTS "ModerationItem_type_idx" ON "ModerationItem"("type");
  ` },
  { name: 'Poster', sql: `
    CREATE TABLE IF NOT EXISTS "Poster" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "theme" TEXT,
      "content" JSONB,
      "imageUrl" TEXT,
      "sizes" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  ` },
  { name: 'NewsletterPlan', sql: `
    CREATE TABLE IF NOT EXISTS "NewsletterPlan" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "year" INTEGER NOT NULL,
      "month" INTEGER NOT NULL,
      "theme" TEXT,
      "subject" TEXT,
      "audiences" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "scheduledAt" TIMESTAMP(3),
      "notes" TEXT,
      "status" TEXT NOT NULL DEFAULT 'planned',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterPlan_year_month_key" ON "NewsletterPlan"("year", "month");
  ` },
  { name: 'SocialPost', sql: `
    CREATE TABLE IF NOT EXISTS "SocialPost" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "platform" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "mediaUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "scheduledAt" TIMESTAMP(3),
      "publishedAt" TIMESTAMP(3),
      "status" TEXT NOT NULL DEFAULT 'draft',
      "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "externalId" TEXT,
      "errorMessage" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "SocialPost_scheduledAt_idx" ON "SocialPost"("scheduledAt");
    CREATE INDEX IF NOT EXISTS "SocialPost_platform_status_idx" ON "SocialPost"("platform", "status");
  ` },
  { name: 'RichPage', sql: `
    CREATE TABLE IF NOT EXISTS "RichPage" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "slug" TEXT NOT NULL UNIQUE,
      "title" TEXT NOT NULL,
      "bodyHtml" TEXT,
      "meta" JSONB,
      "status" TEXT NOT NULL DEFAULT 'draft',
      "position" INTEGER NOT NULL DEFAULT 0,
      "parentId" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "RichPage_status_idx" ON "RichPage"("status");
    CREATE INDEX IF NOT EXISTS "RichPage_parentId_position_idx" ON "RichPage"("parentId", "position");
  ` },
  { name: 'Partner', sql: `
    CREATE TABLE IF NOT EXISTS "Partner" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "slug" TEXT NOT NULL UNIQUE,
      "logoUrl" TEXT,
      "websiteUrl" TEXT,
      "description" TEXT,
      "category" TEXT,
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "position" INTEGER NOT NULL DEFAULT 0,
      "contactName" TEXT,
      "contactEmail" TEXT,
      "active" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "Partner_active_position_idx" ON "Partner"("active", "position");
    CREATE INDEX IF NOT EXISTS "Partner_featured_idx" ON "Partner"("featured");
  ` },
  // ──────────────────────────────────────────────────────────────────────
  // Phase A : 11 tables pour CRM/Leads + IA core + IA avancée + Intégrations
  // ──────────────────────────────────────────────────────────────────────
  { name: 'EmailTemplate', sql: `
    CREATE TABLE IF NOT EXISTS "EmailTemplate" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "slug" TEXT NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "category" TEXT,
      "subject" TEXT NOT NULL,
      "bodyHtml" TEXT NOT NULL,
      "bodyText" TEXT,
      "variables" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "audience" TEXT,
      "isSystem" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "EmailTemplate_category_idx" ON "EmailTemplate"("category");
  ` },
  { name: 'ScraperJob', sql: `
    CREATE TABLE IF NOT EXISTS "ScraperJob" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT,
      "sourceUrl" TEXT NOT NULL,
      "depth" INTEGER NOT NULL DEFAULT 1,
      "status" TEXT NOT NULL DEFAULT 'pending',
      "leadCount" INTEGER NOT NULL DEFAULT 0,
      "errorCount" INTEGER NOT NULL DEFAULT 0,
      "config" JSONB,
      "results" JSONB,
      "startedAt" TIMESTAMP(3),
      "finishedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "ScraperJob_status_idx" ON "ScraperJob"("status");
  ` },
  { name: 'AiAutopilotRule', sql: `
    CREATE TABLE IF NOT EXISTS "AiAutopilotRule" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "trigger" TEXT NOT NULL,
      "triggerConfig" JSONB,
      "action" TEXT NOT NULL,
      "actionConfig" JSONB,
      "schedule" TEXT,
      "active" BOOLEAN NOT NULL DEFAULT true,
      "lastRunAt" TIMESTAMP(3),
      "lastRunStatus" TEXT,
      "runsCount" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "AiAutopilotRule_active_idx" ON "AiAutopilotRule"("active");
  ` },
  { name: 'AiManual', sql: `
    CREATE TABLE IF NOT EXISTS "AiManual" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "slug" TEXT NOT NULL UNIQUE,
      "title" TEXT NOT NULL,
      "audience" TEXT NOT NULL,
      "tone" TEXT,
      "language" TEXT NOT NULL DEFAULT 'fr',
      "content" TEXT NOT NULL,
      "outline" JSONB,
      "provider" TEXT,
      "model" TEXT,
      "tokensUsed" INTEGER,
      "videoScript" TEXT,
      "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "AiManual_audience_idx" ON "AiManual"("audience");
  ` },
  { name: 'RagSource', sql: `
    CREATE TABLE IF NOT EXISTS "RagSource" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "url" TEXT,
      "config" JSONB,
      "lastIndexedAt" TIMESTAMP(3),
      "chunksCount" INTEGER NOT NULL DEFAULT 0,
      "tokensCount" INTEGER NOT NULL DEFAULT 0,
      "active" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  ` },
  { name: 'RagChunk', sql: `
    CREATE TABLE IF NOT EXISTS "RagChunk" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "sourceId" TEXT NOT NULL,
      "text" TEXT NOT NULL,
      "embedding" DOUBLE PRECISION[],
      "metadata" JSONB,
      "position" INTEGER NOT NULL DEFAULT 0,
      "tokens" INTEGER,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "RagChunk_sourceId_idx" ON "RagChunk"("sourceId");
  ` },
  { name: 'TelegramAlert', sql: `
    CREATE TABLE IF NOT EXISTS "TelegramAlert" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "chatId" TEXT NOT NULL,
      "type" TEXT,
      "message" TEXT NOT NULL,
      "parseMode" TEXT,
      "sentAt" TIMESTAMP(3),
      "status" TEXT NOT NULL DEFAULT 'pending',
      "error" TEXT,
      "metadata" JSONB,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "TelegramAlert_status_idx" ON "TelegramAlert"("status");
  ` },
  { name: 'IntegrationConfig', sql: `
    CREATE TABLE IF NOT EXISTS "IntegrationConfig" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "provider" TEXT NOT NULL UNIQUE,
      "displayName" TEXT,
      "active" BOOLEAN NOT NULL DEFAULT false,
      "config" JSONB,
      "lastSyncAt" TIMESTAMP(3),
      "lastSyncStatus" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  ` },
  { name: 'Theme', sql: `
    CREATE TABLE IF NOT EXISTS "Theme" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "slug" TEXT NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "season" TEXT,
      "palette" JSONB NOT NULL,
      "fonts" JSONB,
      "blocks" JSONB,
      "active" BOOLEAN NOT NULL DEFAULT false,
      "scheduledFrom" TIMESTAMP(3),
      "scheduledUntil" TIMESTAMP(3),
      "previewImage" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "Theme_active_idx" ON "Theme"("active");
  ` },
  { name: 'FeatureFlag', sql: `
    CREATE TABLE IF NOT EXISTS "FeatureFlag" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "key" TEXT NOT NULL UNIQUE,
      "displayName" TEXT,
      "description" TEXT,
      "value" BOOLEAN NOT NULL DEFAULT false,
      "rollout" INTEGER NOT NULL DEFAULT 100,
      "conditions" JSONB,
      "audience" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  ` },
  { name: 'Translation', sql: `
    CREATE TABLE IF NOT EXISTS "Translation" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "namespace" TEXT NOT NULL DEFAULT 'default',
      "key" TEXT NOT NULL,
      "lang" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "context" TEXT,
      "approved" BOOLEAN NOT NULL DEFAULT false,
      "translatedBy" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "Translation_ns_key_lang_key" ON "Translation"("namespace", "key", "lang");
    CREATE INDEX IF NOT EXISTS "Translation_lang_idx" ON "Translation"("lang");
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
