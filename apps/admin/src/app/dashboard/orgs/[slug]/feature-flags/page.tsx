import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#f59e0b", "accentColor": "#f59e0b"}];

export default async function FeatureFlagsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🚦" title="Feature flags" desc="Active/désactive des features sans redéployer"
      cards={cards}
    />
  );
}
