import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Récolte automatisée", "icon": "🎤", "description": "Envoie un lien magique, le client enregistre", "borderColor": "#d946ef", "accentColor": "#d946ef", "bullets": [{"label": "FEATURES", "items": ["Vidéo selfie", "Audio only option", "Trim auto silences"]}]}, {"title": "Transcription IA", "icon": "📝", "description": "Sous-titres + extraction citation", "borderColor": "#d946ef", "accentColor": "#d946ef", "bullets": [{"label": "FEATURES", "items": ["Whisper transcript", "Pull quote", "Multi-langue"]}]}, {"title": "Affichage carousel", "icon": "🎠", "description": "Component prêt pour ta home", "borderColor": "#d946ef", "accentColor": "#d946ef", "bullets": [{"label": "FEATURES", "items": ["Auto-play", "Photo + texte", "Star rating"]}]}];

export default async function TestimonialsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🎥" title="Témoignages vidéo" desc="Vidéos clients + écrits pour ta home et tes landing."
      cards={cards}
    />
  );
}
