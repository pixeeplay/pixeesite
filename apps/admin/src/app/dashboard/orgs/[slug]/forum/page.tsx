import { SimpleListClient } from '@/components/SimpleListClient';

export default async function ForumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <SimpleListClient
      orgSlug={slug} emoji="💬" title="Forum / Discussions"
      desc="Crée des espaces de discussion pour ta communauté"
      entity="forum-threads"
      fields={[
        { name: 'title', label: 'Titre du sujet', required: true },
        { name: 'body', label: 'Message d\'introduction', type: 'textarea' },
      ]}
    />
  );
}
