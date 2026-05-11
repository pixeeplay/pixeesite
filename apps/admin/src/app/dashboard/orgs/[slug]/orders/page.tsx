import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Filtres avancés", "icon": "🔍", "description": "Filter par statut, date, montant, client", "borderColor": "#3b82f6", "accentColor": "#3b82f6", "bullets": [{"label": "FEATURES", "items": ["paid / shipped / delivered / refunded", "Date range", "Search email"]}]}, {"title": "Workflow shipping", "icon": "🚚", "description": "Mark as shipped, send tracking", "borderColor": "#3b82f6", "accentColor": "#3b82f6", "bullets": [{"label": "FEATURES", "items": ["Auto-email avec tracking", "Boxtal / Shippo intégration", "Étiquettes prêtes"]}]}, {"title": "Refunds Stripe", "icon": "↩️", "description": "Remboursement partiel/total 1-clic", "borderColor": "#3b82f6", "accentColor": "#3b82f6", "bullets": [{"label": "FEATURES", "items": ["Stripe Refund API", "Auto-email client", "Audit log"]}]}];

export default async function OrdersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🧾" title="Commandes" desc="Toutes les commandes de ta boutique."
      cards={cards}
    />
  );
}
