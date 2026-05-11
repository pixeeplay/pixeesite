import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#10b981", "accentColor": "#10b981"}];

export default async function DropshippingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="📥" title="Dropshipping" desc="Connecte AliExpress, Spocket, Modalyst"
      cards={cards}
    />
  );
}
