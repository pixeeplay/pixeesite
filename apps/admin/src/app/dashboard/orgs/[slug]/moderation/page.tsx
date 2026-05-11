import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#ef4444", "accentColor": "#ef4444"}];

export default async function ModerationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🛡️" title="Modération" desc="File d attente IA pour valider/rejeter contributions"
      cards={cards}
    />
  );
}
