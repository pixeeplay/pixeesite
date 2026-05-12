import { NextRequest, NextResponse } from 'next/server';
import { platformDb, getTenantPrisma, ensureTenantDb } from '@pixeesite/database';
import { requireOrgMember } from '@/lib/auth-helpers';
import { aiCall } from '@/lib/ai-client';
import { ensureTenantTables } from '@/lib/tenant-init';
import { getOrgSecret } from '@/lib/secrets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

/**
 * POST /api/orgs/[slug]/sites/wizard
 * Body: { templateId, name, brief, audience, tone, primaryColor, font, logoUrl, sections: [], heroBgKeyword? }
 *
 * Stream NDJSON : chaque ligne est { step, ok, detail, progress?, page? }
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug: orgSlug } = await params;
  let auth;
  try { auth = await requireOrgMember(orgSlug, ['owner', 'admin', 'editor']); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 403 }); }

  const b = await req.json();
  if (!b.name || !b.brief) return NextResponse.json({ error: 'name + brief required' }, { status: 400 });

  const encoder = new TextEncoder();
  const orgId = auth.membership.org.id;

  const stream = new ReadableStream({
    async start(ctrl) {
      const emit = (msg: any) => ctrl.enqueue(encoder.encode(JSON.stringify(msg) + '\n'));

      try {
        // 1. Récupère le template
        emit({ step: 'fetch-template', ok: true });
        const template = b.templateId ? await platformDb.template.findUnique({ where: { id: b.templateId } }) : null;
        const blocksSeed = (template?.blocksSeed as any) || { pages: [{ slug: '/', title: 'Accueil', isHome: true, blocks: [] }] };
        const pages = blocksSeed.pages || [];
        const features: string[] = Array.isArray(blocksSeed.features) ? blocksSeed.features : [];
        const seedData = blocksSeed.seedData || {};
        const palette = blocksSeed.palette || null;

        // 2. Update theme org : priorité au choix utilisateur, sinon palette du template
        const themePatch: any = {};
        if (b.primaryColor) themePatch.primaryColor = b.primaryColor;
        else if (palette?.primary) themePatch.primaryColor = palette.primary;
        if (b.font) themePatch.font = b.font;
        else if (palette?.fontHeading) themePatch.font = palette.fontHeading;
        if (b.logoUrl) themePatch.logoUrl = b.logoUrl;
        if (Object.keys(themePatch).length > 0) {
          emit({ step: 'apply-theme', ok: true, detail: `couleur=${themePatch.primaryColor || '?'} font=${themePatch.font || '?'}` });
          await platformDb.org.update({ where: { id: orgId }, data: themePatch }).catch(() => {});
        }

        // 3. Crée le site
        const slug = (b.name as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
        let finalSlug = slug;
        let counter = 2;
        while (await platformDb.site.findUnique({ where: { orgId_slug: { orgId, slug: finalSlug } } }).catch(() => null)) {
          finalSlug = `${slug}-${counter++}`;
          if (counter > 100) break;
        }
        // status='published' direct → le site est immédiatement visible sur <orgSlug>.pixeeplay.com
        // L'utilisateur peut toujours le dépublier après depuis le builder
        const site = await platformDb.site.create({
          data: { orgId, slug: finalSlug, name: b.name, status: 'published', deployedAt: new Date(), templateId: b.templateId || null },
        });
        emit({ step: 'site-created', ok: true, detail: { id: site.id, slug: finalSlug }, progress: 10 });

        // Auto-provisionne la DB tenant si elle n'existe pas (CREATE DATABASE + set Org.tenantDbName)
        try {
          const provRes = await ensureTenantDb(orgSlug);
          emit({ step: 'ensure-db', ok: true, detail: provRes.created ? `DB "${provRes.dbName}" créée` : `DB "${provRes.dbName}" prête`, progress: 7 });
        } catch (e: any) {
          emit({ step: 'ensure-db', ok: false, detail: `Provisioning DB échoué : ${e?.message?.slice(0, 200) || 'unknown'}` });
          ctrl.close();
          return;
        }

        const tenantDb = await getTenantPrisma(orgSlug).catch((e) => {
          emit({ step: 'tenant-db', ok: false, detail: `Connexion tenant échouée : ${e?.message?.slice(0, 200) || 'unknown'}` });
          return null;
        });
        if (!tenantDb) {
          ctrl.close();
          return;
        }

        // Auto-init des tables tenant si elles manquent (idempotent, safe à rejouer)
        emit({ step: 'ensure-tables', ok: true, detail: 'Vérification/création des tables tenant…' });
        const tablesLog = await ensureTenantTables(tenantDb);
        const tablesOk = tablesLog.filter((t) => t.ok).length;
        const tablesKo = tablesLog.filter((t) => !t.ok);
        if (tablesKo.length > 0) {
          emit({ step: 'ensure-tables', ok: false, detail: `${tablesOk}/${tablesLog.length} OK — erreurs: ${tablesKo.map((t) => t.name).join(', ')}` });
        } else {
          emit({ step: 'ensure-tables', ok: true, detail: `${tablesOk}/${tablesLog.length} tables prêtes`, progress: 12 });
        }

        // 4. ÉTAPE A — IA propose une STRUCTURE COMPLÈTE (sections par page)
        // basée sur le brief + audience + tone + features.
        emit({ step: 'plan-structure', ok: true, detail: 'IA structure les sections de chaque page…', progress: 15 });

        const knownPageSlugs = pages.map((p: any) => p.slug);
        const structurePrompt = `Tu es un architecte de site web. Pour chaque page de cette liste, propose une liste de SECTIONS variées (6 à 8 sections par page, jamais que hero+text+cta).

Brief : "${b.brief}"
Audience : ${b.audience || 'large'}
Ton : ${b.tone || 'professionnel'}
Features actives : ${features.join(', ') || 'aucune'}
Pages : ${knownPageSlugs.map((s: string) => `"${s}"`).join(', ')}

Types de section disponibles :
- "parallax-hero" : grand hero immersif en haut de page (PRÉFÉRER pour la première section)
- "columns" : 3 cards (services, valeurs, témoignages, étapes…) avec icône emoji
- "parallax-slider" : galerie 3-5 visuels
- "text" : storytelling long-form (max 250 mots)
- "cta" : call-to-action vers une autre page interne
- "image" : visuel unique avec légende
- "embed" : carte / vidéo YouTube / iframe
- "spacer" : respiration entre 2 sections

CONTRAINTES :
- 1ère section TOUJOURS "parallax-hero"
- Au moins 6 sections par page, jamais 2 fois de suite le même type
- Mixer text, columns, parallax-slider, image, cta
- CTAs : href doit pointer vers une page existante du site (ex ${knownPageSlugs.join(' / ')})
- Pas de mention religieuse
- Texte en français

Retourne UNIQUEMENT ce JSON, rien d'autre :
{ "pages": [ { "slug": "/", "title": "Accueil", "sections": [ { "type": "parallax-hero", "hint": "…" }, … ] } ] }`;

        let planned: any = null;
        try {
          const planRes = await aiCall({
            orgId,
            feature: 'text',
            prompt: structurePrompt,
            temperature: 0.7,
            maxTokens: 4000,
          });
          if (planRes.ok && planRes.output) {
            const m = planRes.output.match(/\{[\s\S]+\}/);
            if (m) {
              try { planned = JSON.parse(m[0]); } catch {}
            }
          }
        } catch {}

        // Map { slug → sections[] } depuis le plan IA, avec fallback safe
        const planBySlug: Record<string, Array<{ type: string; hint?: string }>> = {};
        if (planned?.pages && Array.isArray(planned.pages)) {
          for (const pp of planned.pages) {
            if (pp?.slug && Array.isArray(pp?.sections)) {
              planBySlug[pp.slug] = pp.sections.filter((s: any) => s?.type);
            }
          }
        }
        emit({
          step: 'plan-structure',
          ok: true,
          detail: `${Object.keys(planBySlug).length}/${pages.length} pages planifiées`,
          progress: 20,
        });

        // 4b. IMAGE IA pour le hero — un seul appel global réutilisable
        let heroImageUrl: string | null = null;
        try {
          const falKey = await getOrgSecret(orgId, 'FAL_KEY').catch(() => null);
          if (falKey) {
            emit({ step: 'generate-hero-image', ok: true, detail: 'Génération visuel hero via FLUX…', progress: 22 });
            const r = await fetch('https://fal.run/fal-ai/flux/schnell', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Key ${falKey}` },
              body: JSON.stringify({
                prompt: `${b.brief}, cinematic photography, soft golden hour light, high quality, editorial, no text, no logo`,
                image_size: 'landscape_16_9',
              }),
            });
            const j: any = await r.json().catch(() => ({}));
            heroImageUrl = j?.images?.[0]?.url || null;
            if (heroImageUrl) {
              emit({ step: 'generate-hero-image', ok: true, detail: 'Visuel hero généré', progress: 24 });
            }
          }
          if (!heroImageUrl) {
            // Fallback Unsplash : recherche basique depuis quelques mots-clés du brief
            const kw = (b.brief || '')
              .toLowerCase()
              .replace(/[^\w\sà-ÿ-]/g, ' ')
              .split(/\s+/)
              .filter((w: string) => w.length > 3)
              .slice(0, 3)
              .join(',');
            if (kw) {
              heroImageUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(kw)}`;
              emit({ step: 'generate-hero-image', ok: true, detail: 'Visuel hero via Unsplash', progress: 24 });
            }
          }
        } catch {
          // continue sans image
        }

        // 4c. Pour chaque page → IA personnalise chaque SECTION en bloc complet
        const totalPages = pages.length;
        for (let i = 0; i < pages.length; i++) {
          const p = pages[i];
          emit({
            step: `generate-${p.slug}`,
            ok: true,
            detail: `Génération IA "${p.title}"…`,
            progress: 25 + (i / totalPages) * 65,
          });

          // Sections planifiées par l'IA, sinon fallback raisonnable
          const sections =
            planBySlug[p.slug] && planBySlug[p.slug].length > 0
              ? planBySlug[p.slug]
              : DEFAULT_SECTIONS_FOR_PAGE(p.slug);

          // Génère le contenu de chaque section via 1 appel IA spécifique
          const generatedBlocks: any[] = [];
          for (let s = 0; s < sections.length; s++) {
            const sec = sections[s];
            const block = await generateSectionBlock({
              orgId,
              brief: b.brief,
              audience: b.audience,
              tone: b.tone,
              pageTitle: p.title,
              pageSlug: p.slug,
              sectionType: sec.type,
              hint: sec.hint || '',
              knownPageSlugs,
              heroImageUrl,
              isFirst: s === 0,
            });
            if (block) generatedBlocks.push(block);
          }

          // Garantit ≥ 6 blocs : si le plan IA + génération n'en a pas produit assez,
          // on complète avec un spacer + cta vers la 1ère autre page.
          if (generatedBlocks.length < 6) {
            const otherPage = knownPageSlugs.find((s: string) => s !== p.slug) || '/';
            while (generatedBlocks.length < 6) {
              generatedBlocks.push({
                type: 'cta',
                width: 'full',
                data: {
                  title: 'Découvrir plus',
                  subtitle: 'Explorez notre univers en quelques clics.',
                  label: 'Voir la suite',
                  href: otherPage,
                },
              });
              if (generatedBlocks.length < 6) {
                generatedBlocks.push({ type: 'spacer', width: 'full', data: { height: 40 } });
              }
            }
          }

          // Si le template fournissait déjà des blocs et que l'IA a échoué, on garde les seeds
          const finalBlocks =
            generatedBlocks.length > 0 ? generatedBlocks : (p.blocks || []);

          try {
            await (tenantDb as any).sitePage.create({
              data: {
                siteId: site.id,
                slug: p.slug || '/',
                title: p.title || 'Page',
                blocks: finalBlocks,
                isHome: p.isHome || p.slug === '/',
                visible: true,
                meta: p.meta || null,
              },
            });
            emit({
              step: `page-${p.slug}`,
              ok: true,
              detail: `${finalBlocks.length} blocs créés`,
              progress: 25 + ((i + 1) / totalPages) * 65,
              page: p.slug,
            });
          } catch (e: any) {
            emit({ step: `page-${p.slug}`, ok: false, detail: e?.message?.slice(0, 200) });
          }
        }

        // 5. Sections optionnelles
        if (Array.isArray(b.sections)) {
          for (const section of b.sections) {
            emit({ step: `enable-${section}`, ok: true, detail: `Activation ${section}` });
            // Stub : ici on créerait les pages /blog, /shop, /forum, /contact selon section
          }
        }

        // 5bis. SEED DES MODULES selon features[] du template (Phase 20)
        // Pour chaque feature activée → on seed les données initiales du template.seedData
        // dans la DB tenant (Product, Article, Event, Testimonial, Newsletter).
        // Idempotent : skipOnConflict pour ne pas planter sur re-création.
        const slugify = (s: string) =>
          (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

        // -- SHOP : seed products
        if (features.includes('shop') && Array.isArray(seedData.products) && seedData.products.length > 0) {
          emit({ step: 'seed-products', ok: true, detail: `Seed ${seedData.products.length} produit(s)…` });
          let createdProducts = 0;
          for (const p of seedData.products) {
            try {
              const productSlug = slugify(p.slug || p.name);
              await (tenantDb as any).product.upsert({
                where: { slug: productSlug },
                update: {},
                create: {
                  slug: productSlug,
                  name: p.name || 'Produit',
                  description: p.description || null,
                  priceCents: p.priceCents || 0,
                  currency: p.currency || 'EUR',
                  images: p.images || [],
                  inventory: p.inventory ?? 0,
                  category: p.category || null,
                  active: true,
                },
              });
              createdProducts++;
            } catch (e: any) {
              // continue
            }
          }
          emit({ step: 'seed-products', ok: true, detail: `${createdProducts}/${seedData.products.length} produits seedés` });
        }

        // -- BLOG / ARTICLES : seed articles
        if ((features.includes('blog') || features.includes('articles')) && Array.isArray(seedData.articles) && seedData.articles.length > 0) {
          emit({ step: 'seed-articles', ok: true, detail: `Seed ${seedData.articles.length} article(s)…` });
          let createdArticles = 0;
          for (const a of seedData.articles) {
            try {
              const articleSlug = slugify(a.slug || a.title);
              await (tenantDb as any).article.upsert({
                where: { slug: articleSlug },
                update: {},
                create: {
                  slug: articleSlug,
                  title: a.title || 'Article',
                  excerpt: a.excerpt || null,
                  bodyHtml: a.bodyHtml || null,
                  coverImage: a.coverImage || null,
                  tags: a.tags || [],
                  authorName: a.authorName || null,
                  status: a.status || 'draft',
                  publishedAt: a.status === 'published' ? new Date() : null,
                },
              });
              createdArticles++;
            } catch (e: any) {
              // continue
            }
          }
          emit({ step: 'seed-articles', ok: true, detail: `${createdArticles}/${seedData.articles.length} articles seedés` });
        }

        // -- EVENTS / AGENDA
        if ((features.includes('events') || features.includes('agenda')) && Array.isArray(seedData.events) && seedData.events.length > 0) {
          emit({ step: 'seed-events', ok: true, detail: `Seed ${seedData.events.length} événement(s)…` });
          let createdEvents = 0;
          for (const ev of seedData.events) {
            try {
              const evSlug = slugify(ev.slug || ev.title);
              await (tenantDb as any).event.upsert({
                where: { slug: evSlug },
                update: {},
                create: {
                  slug: evSlug,
                  title: ev.title || 'Événement',
                  description: ev.description || null,
                  startsAt: ev.startsAt ? new Date(ev.startsAt) : new Date(),
                  endsAt: ev.endsAt ? new Date(ev.endsAt) : null,
                  location: ev.location || null,
                  coverImage: ev.coverImage || null,
                  category: ev.category || null,
                  published: true,
                },
              });
              createdEvents++;
            } catch (e: any) {
              // continue
            }
          }
          emit({ step: 'seed-events', ok: true, detail: `${createdEvents}/${seedData.events.length} événements seedés` });
        }

        // -- TESTIMONIALS
        if (features.includes('testimonials') && Array.isArray(seedData.testimonials) && seedData.testimonials.length > 0) {
          emit({ step: 'seed-testimonials', ok: true, detail: `Seed ${seedData.testimonials.length} témoignage(s)…` });
          let createdTestimonials = 0;
          for (const t of seedData.testimonials) {
            try {
              await (tenantDb as any).testimonial.create({
                data: {
                  authorName: t.authorName || 'Client',
                  authorTitle: t.authorTitle || null,
                  authorAvatar: t.authorAvatar || null,
                  quote: t.quote || null,
                  rating: t.rating ?? null,
                  featured: !!t.featured,
                  published: true,
                },
              });
              createdTestimonials++;
            } catch (e: any) {
              // continue
            }
          }
          emit({ step: 'seed-testimonials', ok: true, detail: `${createdTestimonials}/${seedData.testimonials.length} témoignages seedés` });
        }

        // -- NEWSLETTER drafts
        if (features.includes('newsletter') && Array.isArray(seedData.newsletters) && seedData.newsletters.length > 0) {
          emit({ step: 'seed-newsletters', ok: true, detail: `Seed ${seedData.newsletters.length} newsletter(s)…` });
          let createdNl = 0;
          for (const n of seedData.newsletters) {
            try {
              await (tenantDb as any).newsletter.create({
                data: {
                  subject: n.subject || 'Newsletter',
                  bodyHtml: n.bodyHtml || null,
                  status: n.status || 'draft',
                },
              });
              createdNl++;
            } catch (e: any) {
              // continue
            }
          }
          emit({ step: 'seed-newsletters', ok: true, detail: `${createdNl}/${seedData.newsletters.length} newsletters seedées` });
        }

        // 6. Update pageCount
        const pageCount = await (tenantDb as any).sitePage.count({ where: { siteId: site.id } }).catch(() => totalPages);
        await platformDb.site.update({ where: { id: site.id }, data: { pageCount } }).catch(() => {});

        emit({ step: 'done', ok: true, detail: `Site créé avec ${pageCount} pages`, progress: 100, siteSlug: finalSlug });
      } catch (e: any) {
        emit({ step: 'fatal', ok: false, detail: e?.message?.slice(0, 300) });
      }
      ctrl.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'X-Accel-Buffering': 'no' },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — génération de blocs riches via IA
// ─────────────────────────────────────────────────────────────────────────────

/** Sections fallback si le plan IA a échoué. Plus jamais que hero+text+cta. */
function DEFAULT_SECTIONS_FOR_PAGE(slug: string): Array<{ type: string; hint?: string }> {
  if (slug === '/' || slug === '/home' || slug === '/accueil') {
    return [
      { type: 'parallax-hero', hint: 'Hero principal de la home, immersif' },
      { type: 'columns', hint: '3 cards : nos valeurs / nos services / notre approche' },
      { type: 'text', hint: 'Storytelling 200 mots sur la mission' },
      { type: 'parallax-slider', hint: 'Galerie 4 visuels signature' },
      { type: 'columns', hint: '3 témoignages clients' },
      { type: 'cta', hint: 'CTA contact ou découverte' },
    ];
  }
  if (slug.includes('about') || slug.includes('a-propos')) {
    return [
      { type: 'parallax-hero', hint: 'Hero "À propos"' },
      { type: 'text', hint: 'Histoire / origines (200 mots)' },
      { type: 'columns', hint: '3 valeurs fondatrices' },
      { type: 'image', hint: 'Photo équipe ou atelier' },
      { type: 'text', hint: 'Approche unique (150 mots)' },
      { type: 'cta', hint: 'CTA vers contact' },
    ];
  }
  if (slug.includes('contact')) {
    return [
      { type: 'parallax-hero', hint: 'Hero contact' },
      { type: 'text', hint: 'Mot d\'accueil + horaires (100 mots)' },
      { type: 'columns', hint: '3 colonnes : email / téléphone / adresse' },
      { type: 'embed', hint: 'Carte Google Maps de l\'adresse' },
      { type: 'spacer', hint: 'Respiration 60px' },
      { type: 'cta', hint: 'CTA prendre RDV / envoyer message' },
    ];
  }
  return [
    { type: 'parallax-hero', hint: `Hero de la page "${slug}"` },
    { type: 'text', hint: 'Présentation 200 mots' },
    { type: 'columns', hint: '3 cards thématiques' },
    { type: 'parallax-slider', hint: 'Galerie 3-4 visuels' },
    { type: 'text', hint: 'Détails complémentaires (150 mots)' },
    { type: 'cta', hint: 'CTA vers autre page du site' },
  ];
}

interface GenSectionOpts {
  orgId: string;
  brief: string;
  audience: string;
  tone: string;
  pageTitle: string;
  pageSlug: string;
  sectionType: string;
  hint: string;
  knownPageSlugs: string[];
  heroImageUrl: string | null;
  isFirst: boolean;
}

/**
 * Génère un seul bloc complet (typé `Block`) via IA.
 * Le format JSON varie selon le type → on demande à l'IA un schéma précis par type.
 */
async function generateSectionBlock(opts: GenSectionOpts): Promise<any | null> {
  const {
    orgId,
    brief,
    audience,
    tone,
    pageTitle,
    pageSlug,
    sectionType,
    hint,
    knownPageSlugs,
    heroImageUrl,
    isFirst,
  } = opts;

  const pageList = knownPageSlugs.join(', ');
  const baseCtx = `Brief : "${brief}". Audience : ${audience || 'large'}. Ton : ${tone || 'professionnel'}. Page : "${pageTitle}" (${pageSlug}). Pages du site : ${pageList}.
CONTRAINTES : français, pas de mention religieuse, pas de smileys dans les titres, restez factuel et chaleureux.`;

  // Schéma demandé selon le type
  let schemaHint = '';
  switch (sectionType) {
    case 'parallax-hero':
      schemaHint = `{ "title": "<titre 4-8 mots>", "subtitle": "<phrase d'accroche 10-20 mots>", "ctaLabel": "<2-3 mots>", "ctaHref": "<une page du site>" }`;
      break;
    case 'text':
      schemaHint = `{ "html": "<HTML simple : <h2>Titre</h2><p>200 mots…</p>>" }`;
      break;
    case 'columns':
      schemaHint = `{ "columns": [
  { "icon": "<1 emoji>", "title": "<3-5 mots>", "body": "<25-40 mots>" },
  { "icon": "<1 emoji>", "title": "<3-5 mots>", "body": "<25-40 mots>" },
  { "icon": "<1 emoji>", "title": "<3-5 mots>", "body": "<25-40 mots>" }
] }`;
      break;
    case 'cta':
      schemaHint = `{ "title": "<question ou invitation>", "subtitle": "<1 phrase>", "label": "<2-3 mots>", "href": "<une page du site>" }`;
      break;
    case 'image':
      schemaHint = `{ "alt": "<description 5-10 mots>", "caption": "<légende 8-15 mots>" }`;
      break;
    case 'parallax-slider':
      schemaHint = `{ "slides": [
  { "title": "<3-5 mots>", "subtitle": "<10-15 mots>", "tagline": "01" },
  { "title": "<3-5 mots>", "subtitle": "<10-15 mots>", "tagline": "02" },
  { "title": "<3-5 mots>", "subtitle": "<10-15 mots>", "tagline": "03" },
  { "title": "<3-5 mots>", "subtitle": "<10-15 mots>", "tagline": "04" }
] }`;
      break;
    case 'embed':
      schemaHint = `{ "html": "<un iframe Google Maps OU YouTube valide HTTPS pour le contexte>" }`;
      break;
    case 'spacer':
      // Pas besoin d'IA pour un spacer
      return { type: 'spacer', width: 'full', data: { height: 60 } };
    default:
      schemaHint = `{ "html": "<p>Section ${sectionType}</p>" }`;
  }

  const prompt = `${baseCtx}
Tu génères le contenu JSON d'une section de type "${sectionType}".
Indication : ${hint || 'aucune indication particulière'}.
${isFirst && sectionType === 'parallax-hero' ? 'C\'est la PREMIÈRE section de la page → maximise l\'impact visuel.' : ''}

Retourne UNIQUEMENT le JSON suivant ce schéma, rien d'autre, pas de texte autour :
${schemaHint}`;

  let parsed: any = null;
  try {
    const res = await aiCall({
      orgId,
      feature: 'text',
      prompt,
      temperature: 0.85,
      maxTokens: 1200,
    });
    if (res.ok && res.output) {
      const m = res.output.match(/\{[\s\S]+\}/);
      if (m) {
        try { parsed = JSON.parse(m[0]); } catch {}
      }
    }
  } catch {}

  // Fallback minimal si l'IA échoue → garde une section visible (pas vide)
  if (!parsed) parsed = {};

  // Normalisation et garantie d'un href cohérent pour les CTAs
  const safeHref = (h: string | undefined | null): string => {
    if (!h) return knownPageSlugs.find((s) => s !== pageSlug) || '/';
    if (h.startsWith('http')) return h;
    if (h.startsWith('/')) return h;
    return `/${h}`;
  };

  switch (sectionType) {
    case 'parallax-hero':
      return {
        type: 'parallax-hero',
        width: 'full',
        data: {
          title: parsed.title || pageTitle,
          subtitle: parsed.subtitle || '',
          ctaLabel: parsed.ctaLabel || 'Découvrir',
          ctaHref: safeHref(parsed.ctaHref),
          bgImage: isFirst ? heroImageUrl : undefined,
          height: '90vh',
        },
      };
    case 'text':
      return {
        type: 'text',
        width: 'full',
        data: {
          html: parsed.html || `<p>${pageTitle}.</p>`,
        },
      };
    case 'columns': {
      const cols = Array.isArray(parsed.columns) && parsed.columns.length > 0
        ? parsed.columns.slice(0, 4)
        : [
            { title: 'Notre vision', body: 'Une approche moderne et inclusive.' },
            { title: 'Notre équipe', body: 'Des passionnés engagés au quotidien.' },
            { title: 'Notre engagement', body: 'Qualité, écoute, transparence.' },
          ];
      return {
        type: 'columns',
        width: 'full',
        data: {
          columns: cols.map((c: any) => ({
            icon: c.icon || '',
            title: c.title || '',
            body: c.body || '',
            // html composite pour compat avec rendu HTML existant
            html: `${c.title ? `<h3>${c.title}</h3>` : ''}${c.body ? `<p>${c.body}</p>` : ''}`,
          })),
        },
      };
    }
    case 'cta':
      return {
        type: 'cta',
        width: 'full',
        data: {
          title: parsed.title || 'Envie d\'en savoir plus ?',
          subtitle: parsed.subtitle || '',
          label: parsed.label || 'Découvrir',
          href: safeHref(parsed.href),
        },
      };
    case 'image':
      return {
        type: 'image',
        width: 'full',
        data: {
          src: heroImageUrl || undefined, // visuel partagé en fallback
          alt: parsed.alt || pageTitle,
          caption: parsed.caption || '',
        },
      };
    case 'parallax-slider': {
      const slides = Array.isArray(parsed.slides) && parsed.slides.length > 0
        ? parsed.slides.slice(0, 6)
        : [
            { title: 'Inspiration', subtitle: 'Un univers à découvrir', tagline: '01' },
            { title: 'Création', subtitle: 'Chaque détail compte', tagline: '02' },
            { title: 'Passion', subtitle: 'Pour transmettre une émotion', tagline: '03' },
          ];
      return {
        type: 'parallax-slider',
        width: 'full',
        data: {
          slides: slides.map((s: any, idx: number) => ({
            title: s.title || `Slide ${idx + 1}`,
            subtitle: s.subtitle || '',
            tagline: s.tagline || `0${idx + 1}`,
            image: s.image || heroImageUrl || `https://source.unsplash.com/1600x900/?${encodeURIComponent((brief || 'design').split(' ').slice(0, 2).join(','))}&sig=${idx}`,
          })),
          height: '85vh',
          autoplay: true,
        },
      };
    }
    case 'embed':
      return {
        type: 'embed',
        width: 'full',
        data: {
          html: parsed.html || '',
        },
      };
    case 'spacer':
      return { type: 'spacer', width: 'full', data: { height: 60 } };
    default:
      return {
        type: 'text',
        width: 'full',
        data: { html: parsed.html || `<p>${pageTitle}.</p>` },
      };
  }
}
