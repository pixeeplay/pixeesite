import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#d946ef", "accentColor": "#d946ef"}];

export default async function SocialCalendarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="📆" title="Calendrier social" desc="Planifie tes posts LinkedIn / X / Insta sur 30 jours"
      cards={cards}
    />
  );
}
