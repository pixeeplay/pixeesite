import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#ec4899", "accentColor": "#ec4899"}];

export default async function NewsletterPlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🗓️" title="Plan newsletter annuel" desc="Planifie 52 newsletters d un coup avec l IA"
      cards={cards}
    />
  );
}
