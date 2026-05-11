import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#f59e0b", "accentColor": "#f59e0b"}];

export default async function EmailTemplatesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="📧" title="Templates emails" desc="Templates de cold mail + transactionnels"
      cards={cards}
    />
  );
}
