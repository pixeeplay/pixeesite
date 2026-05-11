import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#06b6d4", "accentColor": "#06b6d4"}];

export default async function MapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🗺️" title="Carte mondiale" desc="Carte Leaflet de tes lieux / clients / events"
      cards={cards}
    />
  );
}
