import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#10b981", "accentColor": "#10b981"}];

export default async function BulkImportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="📤" title="Import en masse" desc="Upload CSV/JSON pour créer leads/articles/produits en lot"
      cards={cards}
    />
  );
}
