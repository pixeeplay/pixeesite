import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Codes Stripe", "icon": "🎟️", "description": "Créés directement dans Stripe Coupons", "borderColor": "#f59e0b", "accentColor": "#f59e0b", "bullets": [{"label": "FEATURES", "items": ["% off ou montant fixe", "Durée limitée", "Usage limit"]}]}, {"title": "Distribution", "icon": "📤", "description": "Email blast + popup site + influencer codes", "borderColor": "#f59e0b", "accentColor": "#f59e0b", "bullets": [{"label": "FEATURES", "items": ["Resend email", "Exit-intent popup", "Codes uniques"]}]}, {"title": "Tracking utilisation", "icon": "📊", "description": "Conversion rate par code", "borderColor": "#f59e0b", "accentColor": "#f59e0b", "bullets": [{"label": "FEATURES", "items": ["Stripe webhooks", "Funnel analytics", "A/B test discount"]}]}];

export default async function CouponsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🎟️" title="Coupons & promos" desc="Codes promo Stripe + tracking utilisation."
      cards={cards}
    />
  );
}
