'use client';
import { ReactNode } from 'react';
import { EffectWrapper } from './EffectWrapper';
import { ParallaxHero } from './ParallaxHero';
import { ParallaxSlider } from './ParallaxSlider';
import { ThemeProvider, type SiteTheme } from './Theme';

export interface Block {
  id?: string;
  position?: number;
  width?: string;
  height?: string;
  type: string;
  data: any;
  effect?: string | null;
  effectDelay?: number | null;
  visible?: boolean;
}

const WIDTH_CLASS: Record<string, string> = {
  '1/4': 'pxs-w-1-4',
  '1/3': 'pxs-w-1-3',
  '1/2': 'pxs-w-1-2',
  '2/3': 'pxs-w-2-3',
  '3/4': 'pxs-w-3-4',
  full: 'pxs-w-full',
};

const FULL_BLEED_TYPES = new Set(['parallax-hero', 'parallax-slider']);

interface RendererProps {
  blocks: Block[];
  theme?: SiteTheme | null;
  className?: string;
}

/**
 * Rendu d'un tableau de blocs (= contenu de SitePage.blocks JSON).
 * Wrap avec <ThemeProvider> pour injecter les CSS vars.
 */
export function PageBlocksRenderer({ blocks, theme, className = '' }: RendererProps) {
  // Filter visible
  const visible = blocks.filter((b) => b.visible !== false);

  // Sépare les blocs full-bleed (qui sortent du container) des blocs normaux
  const elements: ReactNode[] = [];
  let group: Block[] = [];

  function flushGroup() {
    if (group.length === 0) return;
    elements.push(
      <div key={`grp-${elements.length}`} className="pxs-container pxs-py-md">
        <div className="pxs-row">
          {group.map((b, i) => (
            <div key={`${b.id || i}-${b.position || i}`} className={`${WIDTH_CLASS[b.width || 'full'] || 'pxs-w-full'} pxs-col`}>
              <EffectWrapper effect={b.effect || undefined} delay={b.effectDelay || 0}>
                <BlockRenderer block={b} />
              </EffectWrapper>
            </div>
          ))}
        </div>
      </div>
    );
    group = [];
  }

  visible.forEach((b, i) => {
    if (FULL_BLEED_TYPES.has(b.type)) {
      flushGroup();
      elements.push(
        <EffectWrapper key={`fb-${i}`} effect={b.effect || undefined} delay={b.effectDelay || 0} as="section">
          <BlockRenderer block={b} />
        </EffectWrapper>
      );
    } else {
      group.push(b);
    }
  });
  flushGroup();

  return (
    <ThemeProvider theme={theme} className={className}>
      {/* Inline minimal CSS pour container/cols (pas de Tailwind dans le rendu public) */}
      <style dangerouslySetInnerHTML={{ __html: PXS_LAYOUT_CSS }} />
      {elements}
    </ThemeProvider>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  const d = block.data || {};

  switch (block.type) {
    case 'text': {
      const html = d.html?.trim() || '';
      if (!html) {
        // Fallback typographique élégant si vide
        return (
          <div className="pxs-prose pxs-prose-storytelling">
            <p>Cette section accueillera bientôt votre histoire.</p>
          </div>
        );
      }
      return <div className="pxs-prose pxs-prose-storytelling" dangerouslySetInnerHTML={{ __html: html }} />;
    }

    case 'image': {
      if (!d.src) {
        return (
          <figure className="pxs-image-fallback">
            <div className="pxs-image-skeleton" aria-hidden />
            {d.caption && <figcaption className="pxs-image-caption">{d.caption}</figcaption>}
          </figure>
        );
      }
      return (
        <figure className="pxs-image-wrap">
          <img src={d.src} alt={d.alt || ''} className="pxs-img" />
          {d.caption && <figcaption className="pxs-image-caption">{d.caption}</figcaption>}
        </figure>
      );
    }

    case 'video':
      if (!d.src) return null;
      if (d.src.includes('youtube.com') || d.src.includes('youtu.be')) {
        const id = d.src.match(/(?:v=|youtu\.be\/)([\w-]{11})/)?.[1];
        return id ? <iframe src={`https://www.youtube.com/embed/${id}`} className="pxs-iframe" allowFullScreen /> : null;
      }
      return <video src={d.src} controls className="pxs-img" />;

    case 'cta':
      return (
        <div className="pxs-cta pxs-cta-rich">
          {d.title && <h2 className="pxs-cta-title">{d.title}</h2>}
          {d.subtitle && <p className="pxs-cta-subtitle">{d.subtitle}</p>}
          <a href={d.href || '#'} className="pxs-button-primary pxs-button-large">{d.label || 'Découvrir'}</a>
        </div>
      );

    case 'hero':
      return (
        <div
          className="pxs-hero"
          style={d.bgImage ? { background: `url(${d.bgImage}) center/cover` } : undefined}
        >
          <div className="pxs-hero-overlay" />
          <div className="pxs-hero-content">
            <h1 className="pxs-h1">{d.title || 'Bienvenue'}</h1>
            {d.subtitle && <p className="pxs-hero-subtitle">{d.subtitle}</p>}
            {d.cta?.label && <a href={d.cta?.href || '#'} className="pxs-button-light">{d.cta.label}</a>}
          </div>
        </div>
      );

    case 'parallax-hero':
      return (
        <ParallaxHero
          title={d.title || 'Bienvenue'}
          subtitle={d.subtitle}
          ctaLabel={d.ctaLabel}
          ctaHref={d.ctaHref}
          bgImage={d.bgImage}
          bgGradient={
            d.bgGradient ||
            (!d.bgImage
              ? 'linear-gradient(135deg, var(--pxs-primary, #d946ef) 0%, var(--pxs-secondary, #06b6d4) 100%)'
              : undefined)
          }
          midImage={d.midImage}
          fgImage={d.fgImage}
          overlayColor={d.overlayColor}
          floatingText={d.floatingText}
          height={d.height || '90vh'}
        />
      );

    case 'parallax-slider': {
      if (!Array.isArray(d.slides) || d.slides.length === 0) return null;
      // Si une seule slide → on rend en hero statique (parallax-hero) pour éviter le slider vide
      if (d.slides.length === 1) {
        const s = d.slides[0];
        return (
          <ParallaxHero
            title={s.title || ''}
            subtitle={s.subtitle}
            ctaLabel={s.ctaLabel}
            ctaHref={s.ctaHref}
            bgImage={s.image}
            bgGradient={
              !s.image
                ? 'linear-gradient(135deg, var(--pxs-primary, #d946ef) 0%, var(--pxs-secondary, #06b6d4) 100%)'
                : undefined
            }
            height={d.height || '85vh'}
          />
        );
      }
      return (
        <ParallaxSlider
          slides={d.slides}
          height={d.height || '85vh'}
          autoplay={d.autoplay !== false}
          autoplayDelay={d.autoplayDelay || 6500}
        />
      );
    }

    case 'columns': {
      if (!Array.isArray(d.columns) || d.columns.length === 0) return null;
      const n = Math.min(d.columns.length, 4);
      return (
        <div className={`pxs-columns pxs-columns-${n}`}>
          {d.columns.map((c: any, i: number) => {
            const html = c?.html?.trim() || '';
            const hasIcon = !!c?.icon;
            // Card auto-styling si le contenu contient un h2/h3 (rend la card visible même sans CSS prose lourd)
            return (
              <div key={i} className="pxs-col-card">
                {hasIcon && <div className="pxs-col-icon" aria-hidden>{c.icon}</div>}
                {html ? (
                  <div className="pxs-prose pxs-prose-card" dangerouslySetInnerHTML={{ __html: html }} />
                ) : (
                  <div className="pxs-prose pxs-prose-card">
                    {c?.title && <h3>{c.title}</h3>}
                    {c?.body && <p>{c.body}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    case 'embed':
      if (d.html?.trim()) return <div className="pxs-embed" dangerouslySetInnerHTML={{ __html: d.html }} />;
      if (d.src) {
        return <iframe src={d.src} className="pxs-iframe" allowFullScreen />;
      }
      return null;

    case 'spacer':
      return <div style={{ height: d.height || 60 }} />;

    default:
      console.warn(`[pixeesite] Unknown block type: ${block.type}`);
      return null;
  }
}

const PXS_LAYOUT_CSS = `
.pxs-container { width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 var(--pxs-spacing-md); }
.pxs-py-md { padding-top: var(--pxs-spacing-lg); padding-bottom: var(--pxs-spacing-lg); }
.pxs-row { display: flex; flex-wrap: wrap; gap: var(--pxs-spacing-md); margin: 0 calc(var(--pxs-spacing-sm) * -1); }
.pxs-col { padding: 0 var(--pxs-spacing-sm); margin-bottom: var(--pxs-spacing-md); }
.pxs-w-full { width: 100%; }
.pxs-w-1-4 { width: 100%; }
.pxs-w-1-3 { width: 100%; }
.pxs-w-1-2 { width: 100%; }
.pxs-w-2-3 { width: 100%; }
.pxs-w-3-4 { width: 100%; }
@media (min-width: 768px) {
  .pxs-w-1-4 { width: 25%; }
  .pxs-w-1-3 { width: 33.333%; }
  .pxs-w-1-2 { width: 50%; }
  .pxs-w-2-3 { width: 66.666%; }
  .pxs-w-3-4 { width: 75%; }
}
.pxs-prose { color: var(--pxs-foreground); font-family: var(--pxs-font-body); line-height: 1.75; font-size: 1.0625rem; }
.pxs-prose h1, .pxs-prose h2, .pxs-prose h3, .pxs-prose h4 { font-family: var(--pxs-font-heading); font-weight: 700; line-height: 1.2; margin-top: 2em; margin-bottom: 0.5em; }
.pxs-prose h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
.pxs-prose h2 { font-size: clamp(1.5rem, 4vw, 2.5rem); }
.pxs-prose h3 { font-size: clamp(1.25rem, 3vw, 1.875rem); }
.pxs-prose p { margin: 1em 0; }
.pxs-prose strong { color: var(--pxs-primary); font-weight: 700; }
.pxs-prose a { color: var(--pxs-primary); text-decoration: underline; }
.pxs-prose ul, .pxs-prose ol { padding-left: 1.5em; }
/* Storytelling-grade prose: large readable max-width centered */
.pxs-prose-storytelling { max-width: 720px; margin: 0 auto; font-size: clamp(1.0625rem, 1.6vw, 1.1875rem); }
.pxs-prose-card { font-size: 0.9375rem; line-height: 1.65; }
.pxs-prose-card h3 { margin-top: 0; font-size: 1.25rem; }
.pxs-prose-card p { margin: 0.6em 0; opacity: 0.85; }
/* Image */
.pxs-image-wrap { margin: 0; }
.pxs-img {
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: cover;
  border-radius: var(--pxs-radius);
  display: block;
}
.pxs-image-caption { margin-top: 0.6em; font-size: 0.85rem; opacity: 0.65; text-align: center; }
.pxs-image-fallback { margin: 0; }
.pxs-image-skeleton {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: var(--pxs-radius);
  background: linear-gradient(135deg, color-mix(in srgb, var(--pxs-primary, #d946ef) 25%, transparent), color-mix(in srgb, var(--pxs-secondary, #06b6d4) 25%, transparent));
  position: relative;
  overflow: hidden;
}
.pxs-image-skeleton::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  animation: pxs-shimmer 2.4s linear infinite;
}
@keyframes pxs-shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
/* Iframe & embed */
.pxs-iframe { width: 100%; aspect-ratio: 16/9; border: 0; border-radius: var(--pxs-radius); }
.pxs-embed iframe, .pxs-embed video { width: 100%; border-radius: var(--pxs-radius); border: 0; }
/* CTA */
.pxs-cta { text-align: center; padding: var(--pxs-spacing-md) 0; }
.pxs-cta-rich { padding: var(--pxs-spacing-lg) var(--pxs-spacing-md); }
.pxs-cta-title { font-family: var(--pxs-font-heading); font-size: clamp(1.5rem, 3.5vw, 2.25rem); font-weight: 800; margin: 0 0 0.4em; }
.pxs-cta-subtitle { font-size: 1rem; opacity: 0.7; max-width: 42rem; margin: 0 auto 1.6em; line-height: 1.6; }
.pxs-button-primary {
  display: inline-block;
  background: linear-gradient(135deg, var(--pxs-primary), var(--pxs-secondary));
  color: white; font-weight: 700;
  padding: 0.75em 1.75em; border-radius: 999px; text-decoration: none;
  font-size: 0.95rem; transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
  box-shadow: 0 8px 24px -8px var(--pxs-primary);
}
.pxs-button-primary:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 14px 36px -8px var(--pxs-primary); filter: brightness(1.06); }
.pxs-button-large { font-size: 1.0625rem; padding: 0.95em 2.2em; }
.pxs-button-light {
  display: inline-block; background: white; color: #18181b;
  font-weight: 700; padding: 0.75em 1.5em; border-radius: 999px; text-decoration: none;
}
.pxs-hero {
  position: relative; border-radius: var(--pxs-radius); overflow: hidden;
  padding: var(--pxs-spacing-xl) var(--pxs-spacing-md); text-align: center;
  background: linear-gradient(135deg, var(--pxs-primary), var(--pxs-secondary));
}
.pxs-hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); }
.pxs-hero-content { position: relative; z-index: 1; }
.pxs-h1 { font-family: var(--pxs-font-heading); font-size: clamp(2rem, 6vw, 4rem); font-weight: 900; color: white; margin: 0 0 0.5em; }
.pxs-hero-subtitle { color: rgba(255,255,255,0.92); font-size: 1.125rem; max-width: 42rem; margin: 0 auto 1.5em; }
/* Columns — responsive grid with card styling */
.pxs-columns { display: grid; gap: var(--pxs-spacing-md); }
.pxs-columns-1 { grid-template-columns: 1fr; }
.pxs-columns-2 { grid-template-columns: 1fr; }
.pxs-columns-3 { grid-template-columns: 1fr; }
.pxs-columns-4 { grid-template-columns: 1fr; }
@media (min-width: 640px) {
  .pxs-columns-2 { grid-template-columns: repeat(2, 1fr); }
  .pxs-columns-3 { grid-template-columns: repeat(2, 1fr); }
  .pxs-columns-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 960px) {
  .pxs-columns-3 { grid-template-columns: repeat(3, 1fr); }
  .pxs-columns-4 { grid-template-columns: repeat(4, 1fr); }
}
.pxs-col-card {
  padding: var(--pxs-spacing-md);
  border-radius: var(--pxs-radius);
  background: color-mix(in srgb, var(--pxs-foreground, #fafafa) 4%, transparent);
  border: 1px solid color-mix(in srgb, var(--pxs-foreground, #fafafa) 8%, transparent);
  transition: transform .25s, border-color .25s, background .25s;
}
.pxs-col-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--pxs-primary, #d946ef) 50%, transparent);
  background: color-mix(in srgb, var(--pxs-foreground, #fafafa) 6%, transparent);
}
.pxs-col-icon {
  font-size: 2rem;
  width: 52px; height: 52px;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 14px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--pxs-primary, #d946ef) 80%, transparent), color-mix(in srgb, var(--pxs-secondary, #06b6d4) 80%, transparent));
  margin-bottom: 12px;
}
`;
