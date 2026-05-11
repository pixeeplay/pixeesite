import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#8b5cf6", "accentColor": "#8b5cf6"}];

export default async function ManualsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="📗" title="Manuels auto IA" desc="Génère des manuels d utilisation IA pour 3 audiences (débutants/pros/experts)"
      cards={cards}
    />
  );
}
