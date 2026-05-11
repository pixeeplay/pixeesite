import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Calendrier public", "icon": "🗓️", "description": "Vue mois/semaine/agenda", "borderColor": "#10b981", "accentColor": "#10b981", "bullets": [{"label": "FEATURES", "items": ["Filter catégorie", "Carte intégrée", "Export iCal"]}]}, {"title": "Billetterie Stripe", "icon": "🎫", "description": "Vends des tickets directement", "borderColor": "#10b981", "accentColor": "#10b981", "bullets": [{"label": "FEATURES", "items": ["QR ticket", "Check-in app", "Reporting recettes"]}]}, {"title": "Import Eventbrite/FB", "icon": "📥", "description": "Sync auto depuis sources externes", "borderColor": "#10b981", "accentColor": "#10b981", "bullets": [{"label": "FEATURES", "items": ["Eventbrite API", "Facebook Events", "Meetup"]}]}];

export default async function EventsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="📅" title="Événements" desc="Calendrier événements (concerts, expos, soirées)."
      cards={cards}
    />
  );
}
