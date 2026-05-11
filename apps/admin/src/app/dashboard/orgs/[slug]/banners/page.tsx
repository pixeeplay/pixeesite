import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#8b5cf6", "accentColor": "#8b5cf6"}];

export default async function BannersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🎴" title="Bannières hero" desc="Bannières interchangeables sur ta home"
      cards={cards}
    />
  );
}
