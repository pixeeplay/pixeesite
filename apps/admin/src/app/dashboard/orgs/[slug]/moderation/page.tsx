import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Classification auto Gemini", "icon": "🤖", "description": "Tag chaque post : ok / warning / abuse / spam", "borderColor": "#ef4444", "accentColor": "#ef4444", "bullets": [{"label": "FEATURES", "items": ["Gemini Flash Lite", "Coût < 0.001€/post", "Confidence score"]}]}, {"title": "Queue admin", "icon": "📋", "description": "Inbox unifiée pour tous les posts flaggés", "borderColor": "#ef4444", "accentColor": "#ef4444", "bullets": [{"label": "FEATURES", "items": ["Filter par severity", "Bulk approve/reject", "Audit log"]}]}, {"title": "Auto-ban", "icon": "🚫", "description": "Ban auto après N posts abusifs", "borderColor": "#ef4444", "accentColor": "#ef4444", "bullets": [{"label": "FEATURES", "items": ["Threshold configurable", "Appel possible", "Whitelist trusted users"]}]}];

export default async function ModerationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🛡️" title="Modération IA" desc="File d'attente pour valider/rejeter contributions."
      cards={cards}
    />
  );
}
