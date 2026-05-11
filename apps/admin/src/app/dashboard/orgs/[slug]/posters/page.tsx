import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#ec4899", "accentColor": "#ec4899"}];

export default async function PostersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🖼️" title="Affiches" desc="Génère des affiches A4 / A3 IA pour tes événements"
      cards={cards}
    />
  );
}
