import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Embeddings projetés", "icon": "🔵", "description": "Nuage de points 3D de tes documents indexés", "borderColor": "#3b82f6", "accentColor": "#3b82f6", "bullets": [{"label": "FEATURES", "items": ["UMAP 768→3 dims", "Clusters colorés par catégorie", "Survol = preview document"]}]}, {"title": "Flux IA temps réel", "icon": "⚡", "description": "Voir les requêtes IA en cours, leurs trajectoires", "borderColor": "#3b82f6", "accentColor": "#3b82f6", "bullets": [{"label": "FEATURES", "items": ["Particles flow Three.js", "Provider→model→response", "Latence + coût visible"]}]}, {"title": "Réseau de connexions", "icon": "🕸️", "description": "Graph des similarités entre documents", "borderColor": "#3b82f6", "accentColor": "#3b82f6", "bullets": [{"label": "FEATURES", "items": ["Force-directed layout", "Edges = cosine similarity", "Drag-zoom-rotate"]}]}];

export default async function Brain3dPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🌐" title="Brain 3D" desc="Visualisation 3D Three.js de tes embeddings et flux IA — style JARVIS interactif."
      cards={cards}
    />
  );
}
