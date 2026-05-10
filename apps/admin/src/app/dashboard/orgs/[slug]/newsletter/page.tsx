import { SimpleListClient } from '@/components/SimpleListClient';

export default async function NewsletterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <SimpleListClient
      orgSlug={slug} emoji="✉" title="Newsletter" desc="Campagnes email pour tes abonnés" entity="newsletters"
      fields={[
        { name: 'subject', label: 'Sujet', required: true },
        { name: 'bodyHtml', label: 'Contenu HTML', type: 'textarea' },
      ]}
    />
  );
}
