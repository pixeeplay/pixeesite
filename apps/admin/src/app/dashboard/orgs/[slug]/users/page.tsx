import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#3b82f6", "accentColor": "#3b82f6"}];

export default async function UsersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="👤" title="Utilisateurs" desc="Comptes utilisateurs du site (différent de l équipe org)"
      cards={cards}
    />
  );
}
