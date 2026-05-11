import { FeaturePage } from '@/components/FeaturePage';

const cards = [{"title": "Bientôt disponible", "icon": "🚧", "description": "Cette feature arrive très bientôt. En attendant, explore les autres modules du dashboard !", "borderColor": "#f59e0b", "accentColor": "#f59e0b"}];

export default async function PlaygroundPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <FeaturePage
      orgSlug={slug} emoji="🎮" title="Playground RAG" desc="Teste tes prompts sur ton cerveau RAG (réservé super-admin)"
      cards={cards}
    />
  );
}
