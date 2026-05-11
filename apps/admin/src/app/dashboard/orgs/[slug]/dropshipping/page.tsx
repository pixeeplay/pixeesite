import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "AliExpress API", "icon": "🛍️", "description": "Import produits + auto-fulfill", "borderColor": "#10b981", "accentColor": "#10b981", "bullets": [{"label": "FEATURES", "items": ["Catalogue 100M+", "Price markup auto", "Forward order to supplier"]}]}, {"title": "Spocket", "icon": "🇺🇸", "description": "Suppliers US/EU avec livraison rapide", "borderColor": "#10b981", "accentColor": "#10b981", "bullets": [{"label": "FEATURES", "items": ["3-5j shipping", "Branded invoicing", "Premium products"]}]}, {"title": "Print-on-demand", "icon": "👕", "description": "Printful / Printify integration", "borderColor": "#10b981", "accentColor": "#10b981", "bullets": [{"label": "FEATURES", "items": ["T-shirts, mugs, posters", "Auto-design avec ton logo", "Pas de stock"]}]}];

export default async function DropshippingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="📥" title="Dropshipping" desc="Connecte AliExpress, Spocket, Modalyst."
      cards={cards}
    />
  );
}
