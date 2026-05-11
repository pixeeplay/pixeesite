import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#06b6d4", "accentColor": "#06b6d4"}];

export default async function PagesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="📄" title="Pages riches" desc="Pages statiques (About, Mentions légales, FAQ)"
      cards={cards}
    />
  );
}
