import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Rotation auto", "icon": "🔄", "description": "Cycle entre N bannières selon date/horaire", "borderColor": "#8b5cf6", "accentColor": "#8b5cf6", "bullets": [{"label": "FEATURES", "items": ["Schedule par bannière", "A/B test auto", "Geo-targeting (FR/US/EU)"]}]}, {"title": "Parallax + effets", "icon": "✨", "description": "100 effets wow-arrival/fade/zoom", "borderColor": "#8b5cf6", "accentColor": "#8b5cf6", "bullets": [{"label": "FEATURES", "items": ["ParallaxHero block", "Mouse parallax", "Floating text"]}]}, {"title": "CTA tracking", "icon": "🎯", "description": "Mesure CTR par bannière", "borderColor": "#8b5cf6", "accentColor": "#8b5cf6", "bullets": [{"label": "FEATURES", "items": ["Click events", "Heatmap", "Best performer auto"]}]}];

export default async function BannersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🎴" title="Bannières hero" desc="Bannières interchangeables sur ta home."
      cards={cards}
    />
  );
}
