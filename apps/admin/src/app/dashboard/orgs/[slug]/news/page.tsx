import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Auto-aggregation RSS", "icon": "📡", "description": "Pull depuis 100+ sources RSS", "borderColor": "#3b82f6", "accentColor": "#3b82f6", "bullets": [{"label": "FEATURES", "items": ["Filter par mots-clés", "Dédup IA", "Summary auto Claude"]}]}, {"title": "Curation IA", "icon": "🤖", "description": "Choisis ton angle, l'IA filtre", "borderColor": "#3b82f6", "accentColor": "#3b82f6", "bullets": [{"label": "FEATURES", "items": ["Pro/contre balance", "Local/global tags", "Sentiment analysis"]}]}, {"title": "Push notif app", "icon": "🔔", "description": "Notif aux visiteurs sur nouvelle actu", "borderColor": "#3b82f6", "accentColor": "#3b82f6", "bullets": [{"label": "FEATURES", "items": ["Web push", "OneSignal", "Personnalisation"]}]}];

export default async function NewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="📰" title="Actualités" desc="Newsfeed dynamique pour ton site."
      cards={cards}
    />
  );
}
