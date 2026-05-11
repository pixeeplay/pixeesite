import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Mapper de colonnes", "icon": "🧩", "description": "Drag-drop pour mapper CSV → champs", "borderColor": "#10b981", "accentColor": "#10b981", "bullets": [{"label": "FEATURES", "items": ["Auto-detect headers", "Sample preview", "Save mapping"]}]}, {"title": "Validation + dedup", "icon": "✅", "description": "Skip rows invalides + détecte doublons", "borderColor": "#10b981", "accentColor": "#10b981", "bullets": [{"label": "FEATURES", "items": ["Email unique check", "Format validation", "Dry-run before commit"]}]}, {"title": "Progress + rollback", "icon": "⏪", "description": "Import en background avec progress + rollback", "borderColor": "#10b981", "accentColor": "#10b981", "bullets": [{"label": "FEATURES", "items": ["Job queue Redis", "Live progress", "Undo last import"]}]}];

export default async function BulkImportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="📤" title="Import en masse" desc="Upload CSV/JSON pour créer leads/articles/produits en lot."
      cards={cards}
    />
  );
}
