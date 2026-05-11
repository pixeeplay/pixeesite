import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#3b82f6", "accentColor": "#3b82f6"}];

export default async function TelegramBotPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🤳" title="Bot Telegram" desc="Notifications + commandes vocales vers ton dashboard"
      cards={cards}
    />
  );
}
