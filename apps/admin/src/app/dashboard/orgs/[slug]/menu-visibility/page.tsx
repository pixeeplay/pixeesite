import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#8b5cf6", "accentColor": "#8b5cf6"}];

export default async function MenuVisibilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="👁️" title="Visibilité menu" desc="Qui voit quoi dans le menu (rôles)"
      cards={cards}
    />
  );
}
