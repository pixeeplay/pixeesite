import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Markers personnalisés", "icon": "📍", "description": "Icônes custom par catégorie", "borderColor": "#06b6d4", "accentColor": "#06b6d4", "bullets": [{"label": "FEATURES", "items": ["Cluster auto", "Tooltip card", "Popup détails"]}]}, {"title": "Geocoding auto", "icon": "🌐", "description": "Adresse → lat/lng via Nominatim ou Google", "borderColor": "#06b6d4", "accentColor": "#06b6d4", "bullets": [{"label": "FEATURES", "items": ["Batch geocode", "Cache résultats", "Manual override"]}]}, {"title": "Heatmap density", "icon": "🔥", "description": "Visualise concentration zones", "borderColor": "#06b6d4", "accentColor": "#06b6d4", "bullets": [{"label": "FEATURES", "items": ["Leaflet.heat", "Radius adjustable", "Switch markers/heat"]}]}];

export default async function MapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🗺️" title="Carte mondiale" desc="Carte Leaflet de tes lieux, clients, événements."
      cards={cards}
    />
  );
}
