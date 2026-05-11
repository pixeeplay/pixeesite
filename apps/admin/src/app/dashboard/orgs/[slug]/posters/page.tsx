import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Templates événements", "icon": "🎉", "description": "50 templates A3/A4 pour soirées, expos, concerts", "borderColor": "#ec4899", "accentColor": "#ec4899", "bullets": [{"label": "FEATURES", "items": ["Modifiables", "Variables auto (date, lieu)", "Export PDF print-ready"]}]}, {"title": "Génération IA fal.ai", "icon": "🎨", "description": "FLUX 1.1 Pro pour visuels uniques", "borderColor": "#ec4899", "accentColor": "#ec4899", "bullets": [{"label": "FEATURES", "items": ["Style guidance", "Variations en 1 clic", "4K résolution"]}]}, {"title": "QR code intégré", "icon": "📱", "description": "Lien direct vers événement / boutique", "borderColor": "#ec4899", "accentColor": "#ec4899", "bullets": [{"label": "FEATURES", "items": ["Custom logo", "Track scans", "Dynamic redirect"]}]}];

export default async function PostersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🖼️" title="Affiches IA" desc="Génère des affiches A4 / A3 prêtes à imprimer en 30s."
      cards={cards}
    />
  );
}
