import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#8b5cf6", "accentColor": "#8b5cf6"}];

export default async function ScraperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🕷️" title="Scraper leads" desc="Wizard scraper contacts depuis URLs / Maps / LinkedIn"
      cards={cards}
    />
  );
}
