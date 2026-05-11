import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Sync auto chaîne", "icon": "🔄", "description": "Pull les nouvelles vidéos via YouTube API", "borderColor": "#ef4444", "accentColor": "#ef4444", "bullets": [{"label": "FEATURES", "items": ["Cron 1×/jour", "Auto-publish ou draft", "Thumbnails HQ"]}]}, {"title": "Player embed", "icon": "📺", "description": "Player optimisé lite-youtube-embed", "borderColor": "#ef4444", "accentColor": "#ef4444", "bullets": [{"label": "FEATURES", "items": ["Lazy load", "Pas de cookies tiers avant click", "CSP-friendly"]}]}, {"title": "Playlists par tag", "icon": "🎬", "description": "Filtre auto par catégorie", "borderColor": "#ef4444", "accentColor": "#ef4444", "bullets": [{"label": "FEATURES", "items": ["Tutorials / Demos / Vlogs", "Search dans titres", "Watch count display"]}]}];

export default async function YoutubePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="▶️" title="Vidéos YouTube" desc="Sync auto de ta chaîne YouTube vers ton site."
      cards={cards}
    />
  );
}
