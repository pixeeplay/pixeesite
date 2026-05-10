import { SimpleListClient } from '@/components/SimpleListClient';

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <SimpleListClient
      orgSlug={slug} emoji="📝" title="Blog" desc="Articles + posts pour ton site" entity="articles"
      fields={[
        { name: 'title', label: 'Titre', required: true },
        { name: 'excerpt', label: 'Résumé' },
        { name: 'bodyHtml', label: 'Contenu (HTML)', type: 'textarea' },
        { name: 'coverImage', label: 'Image de couverture (URL)' },
      ]}
    />
  );
}
