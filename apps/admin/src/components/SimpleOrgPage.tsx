'use client';
import Link from 'next/link';
import { ReactNode } from 'react';

/**
 * Page admin générique réutilisable. Layout uniforme avec breadcrumb +
 * titre + description + content.
 */
export function SimpleOrgPage({
  orgSlug, emoji, title, desc, children, actions
}: {
  orgSlug: string;
  emoji: string;
  title: string;
  desc?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 8, fontSize: 13, opacity: 0.5 }}>
        <Link href={`/dashboard/orgs/${orgSlug}`} style={{ color: 'inherit', textDecoration: 'none' }}>← Mon organisation</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, margin: 0 }}>{emoji} {title}</h1>
          {desc && <p style={{ opacity: 0.6, fontSize: 13, margin: '4px 0' }}>{desc}</p>}
        </div>
        {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export const btnPrimary: React.CSSProperties = {
  background: 'linear-gradient(135deg, #d946ef, #06b6d4)', color: 'white', border: 0,
  padding: '10px 16px', borderRadius: 8, fontWeight: 600, cursor: 'pointer',
  textDecoration: 'none', display: 'inline-block', fontSize: 13,
};
export const btnSecondary: React.CSSProperties = {
  background: '#27272a', color: 'inherit', border: '1px solid #3f3f46',
  padding: '10px 16px', borderRadius: 8, fontWeight: 600, cursor: 'pointer',
  textDecoration: 'none', display: 'inline-block', fontSize: 13,
};
export const card: React.CSSProperties = {
  background: '#18181b', border: '1px solid #27272a', borderRadius: 12, padding: 16,
};
export const input: React.CSSProperties = {
  width: '100%', padding: 10, background: '#0a0a0f', border: '1px solid #3f3f46',
  borderRadius: 8, color: 'inherit', fontSize: 13,
};
