import Link from 'next/link';

export function PublicShell({ org, children }: { org: any; children: React.ReactNode }) {
  const primary = org?.primaryColor || '#d946ef';
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fafafa', fontFamily: org?.font || 'Inter, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #27272a', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 24, position: 'sticky', top: 0, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)', zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}>
          {org?.logoUrl
            ? <img src={org.logoUrl} alt={org.name} style={{ height: 28 }} />
            : <span style={{ fontWeight: 800, fontSize: 17, color: primary }}>{org?.name || 'Site'}</span>
          }
        </Link>
        <nav style={{ display: 'flex', gap: 16, marginLeft: 'auto', fontSize: 14 }}>
          <Link href="/blog" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Blog</Link>
          <Link href="/forum" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Forum</Link>
          <Link href="/shop" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Boutique</Link>
          <Link href="/contact" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Contact</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer style={{ borderTop: '1px solid #27272a', padding: '24px', marginTop: 64, textAlign: 'center', fontSize: 12, opacity: 0.5 }}>
        © {new Date().getFullYear()} {org?.name} · Propulsé par <a href="https://pixeesite.com" style={{ color: primary }}>Pixeesite</a>
      </footer>
    </div>
  );
}
