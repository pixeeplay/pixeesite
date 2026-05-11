import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#3b82f6", "accentColor": "#3b82f6"}];

export default async function Brain3dPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🌐" title="Brain 3D" desc="Visualisation 3D Three.js de tes embeddings et flux IA (style JARVIS)"
      cards={cards}
    />
  );
}
