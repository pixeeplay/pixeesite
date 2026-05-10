'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/admin', label: '📊 Dashboard' },
  { href: '/admin/orgs', label: '🏢 Organisations' },
  { href: '/admin/users', label: '👥 Utilisateurs' },
  { href: '/admin/secrets', label: '🔑 Secrets plateforme' },
  { href: '/admin/ai', label: '🤖 IA usage' },
  { href: '/admin/billing', label: '💰 Revenus' },
  { href: '/admin/audit', label: '📜 Audit log' },
];

export function SuperAdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 240, background: '#0a0a0f', borderRight: '1px solid #27272a', padding: '20px 12px', display: 'flex', flexDirection: 'column' }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit', marginBottom: 24, padding: '0 8px' }}>
          <span style={{ fontSize: 22 }}>👑</span>
          <span style={{ fontWeight: 900, fontSize: 16, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SuperAdmin</span>
        </Link>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {items.map((it) => {
            const active = path === it.href || (it.href !== '/admin' && path.startsWith(it.href));
            return (
              <Link key={it.href} href={it.href}
                style={{
                  display: 'block', padding: '8px 12px', borderRadius: 8, fontSize: 14, textDecoration: 'none',
                  color: active ? '#f59e0b' : '#a1a1aa',
                  background: active ? '#f59e0b15' : 'transparent',
                  fontWeight: active ? 600 : 400,
                }}
              >{it.label}</Link>
            );
          })}
        </nav>
        <Link href="/dashboard" style={{ padding: '8px 12px', borderRadius: 8, fontSize: 12, color: '#71717a', textDecoration: 'none', borderTop: '1px solid #27272a', marginTop: 12 }}>
          ← Retour mon dashboard
        </Link>
      </aside>
      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>{children}</main>
    </div>
  );
}
