'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { MegaSearch } from './MegaSearch';
import { colors, gradients, radii } from '@/lib/design-tokens';

interface Org { slug: string; name: string; plan: string; role: string; }

interface NavEntry { href: string; icon: string; label: string; activeWhen?: (path: string) => boolean; section?: string; }

export function DashboardShell({ user, orgs, children }: { user: any; orgs: Org[]; children: React.ReactNode }) {
  const path = usePathname();
  const currentOrgSlug = path.match(/^\/dashboard\/orgs\/([^/]+)/)?.[1];
  const currentOrg = orgs.find((o) => o.slug === currentOrgSlug) || orgs[0];
  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [expanded, setExpanded] = useState<boolean>(true);

  // Persist expanded state
  useEffect(() => {
    const saved = localStorage.getItem('pxs.sidebar.expanded');
    if (saved !== null) setExpanded(saved === '1');
  }, []);
  useEffect(() => { setMobileNavOpen(false); }, [path]);
  function toggleExpanded() {
    const next = !expanded;
    setExpanded(next);
    localStorage.setItem('pxs.sidebar.expanded', next ? '1' : '0');
  }

  const slug = currentOrg?.slug;
  const navItems: NavEntry[] = !slug ? [
    { href: '/dashboard', icon: '🏠', label: 'Accueil' },
  ] : [
    { href: '/dashboard', icon: '🏠', label: 'Accueil', activeWhen: (p) => p === '/dashboard' },
    { href: `/dashboard/orgs/${slug}`, icon: '📊', label: 'Tableau de bord', activeWhen: (p) => p === `/dashboard/orgs/${slug}` },
    { href: `/dashboard/orgs/${slug}`, icon: '📁', label: 'Sites', activeWhen: (p) => p.startsWith(`/dashboard/orgs/${slug}/sites`) },
    { href: `/dashboard/orgs/${slug}/templates`, icon: '✨', label: 'Templates', activeWhen: (p) => p.endsWith('/templates') },
    { href: `/dashboard/orgs/${slug}/ai-theme`, icon: '🪄', label: 'Studio IA', activeWhen: (p) => p.endsWith('/ai-theme') },
    { href: `/dashboard/orgs/${slug}/sitemap`, icon: '🗺️', label: 'Sitemap', activeWhen: (p) => p.endsWith('/sitemap'), section: 'Contenu' },
    { href: `/dashboard/orgs/${slug}/blog`, icon: '📝', label: 'Blog', activeWhen: (p) => p.endsWith('/blog') },
    { href: `/dashboard/orgs/${slug}/newsletter`, icon: '✉️', label: 'Newsletter', activeWhen: (p) => p.endsWith('/newsletter') },
    { href: `/dashboard/orgs/${slug}/forms`, icon: '📋', label: 'Formulaires', activeWhen: (p) => p.endsWith('/forms') },
    { href: `/dashboard/orgs/${slug}/forum`, icon: '💬', label: 'Forum', activeWhen: (p) => p.endsWith('/forum') },
    { href: `/dashboard/orgs/${slug}/leads`, icon: '🎯', label: 'Leads', activeWhen: (p) => p.endsWith('/leads'), section: 'Business' },
    { href: `/dashboard/orgs/${slug}/shop`, icon: '🛒', label: 'Boutique', activeWhen: (p) => p.endsWith('/shop') },
    { href: `/dashboard/orgs/${slug}/tasks`, icon: '✅', label: 'Tâches', activeWhen: (p) => p.endsWith('/tasks') },
    { href: `/dashboard/orgs/${slug}/mail`, icon: '📨', label: 'Webmail', activeWhen: (p) => p.endsWith('/mail') },
    { href: `/dashboard/orgs/${slug}/team`, icon: '👥', label: 'Équipe', activeWhen: (p) => p.endsWith('/team'), section: 'Org' },
    { href: `/dashboard/orgs/${slug}/billing`, icon: '💳', label: 'Facturation', activeWhen: (p) => p.endsWith('/billing') },
    { href: `/dashboard/orgs/${slug}/domains`, icon: '🌐', label: 'Domaines', activeWhen: (p) => p.endsWith('/domains') },
    { href: `/dashboard/orgs/${slug}/keys`, icon: '🔑', label: 'Clés API', activeWhen: (p) => p.endsWith('/keys') },
    { href: `/dashboard/orgs/${slug}/ai`, icon: '🤖', label: 'IA Settings', activeWhen: (p) => p.endsWith('/ai') },
    { href: `/dashboard/orgs/${slug}/security`, icon: '🔐', label: 'Sécurité', activeWhen: (p) => p.endsWith('/security') },
    { href: `/dashboard/orgs/${slug}/settings`, icon: '⚙️', label: 'Paramètres', activeWhen: (p) => p.endsWith('/settings') },
  ];

  const sidebarWidth = expanded ? 220 : 56;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', background: colors.bg, color: colors.text }}>
      <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="pxs-burger"
        style={{ position: 'fixed', top: 12, left: 12, zIndex: 60, background: colors.bgCard, color: 'white', border: `1px solid ${colors.border}`, borderRadius: 8, width: 40, height: 40, cursor: 'pointer', fontSize: 18, display: 'none' }}>
        {mobileNavOpen ? '✕' : '☰'}
      </button>
      <style>{`
        @media (max-width: 768px) {
          .pxs-burger { display: block !important; }
          .pxs-sidebar { position: fixed !important; left: ${mobileNavOpen ? '0' : '-280px'} !important; top: 0; bottom: 0; transition: left .25s; z-index: 50; box-shadow: 4px 0 16px rgba(0,0,0,0.6); width: 220px !important; }
          .pxs-main { padding: 56px 12px 12px !important; }
        }
        .pxs-nav-item { transition: background .15s, color .15s; position: relative; }
        .pxs-nav-item:hover { background: ${colors.bgCardHover} !important; }
        .pxs-nav-tooltip { display: none; position: absolute; left: 100%; top: 50%; transform: translateY(-50%); margin-left: 8px; background: ${colors.bgCard}; border: 1px solid ${colors.borderLight}; padding: 4px 10px; border-radius: 6px; font-size: 12px; white-space: nowrap; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.5); pointer-events: none; }
        .pxs-nav-item:hover .pxs-nav-tooltip { display: block; }
      `}</style>

      {/* Sidebar */}
      <aside className="pxs-sidebar" style={{ width: sidebarWidth, background: colors.bgCard, borderRight: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', padding: '14px 8px', flexShrink: 0, transition: 'width .2s' }}>
        {/* Logo */}
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit', padding: '0 6px', marginBottom: 16, height: 36 }}>
          <span style={{ fontSize: 22 }}>🎨</span>
          {expanded && <span style={{ fontWeight: 900, fontSize: 15, background: gradients.brand, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pixeesite</span>}
        </Link>

        {/* Org switcher */}
        {orgs.length > 0 && expanded && (
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <button onClick={() => setOrgMenuOpen(!orgMenuOpen)}
              style={{ width: '100%', background: '#0a0a0f', border: `1px solid ${colors.border}`, borderRadius: 10, padding: 8, color: 'inherit', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: gradients.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>
                {currentOrg?.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentOrg?.name}</div>
                <div style={{ fontSize: 9, opacity: 0.5, textTransform: 'uppercase' }}>{currentOrg?.plan} · {currentOrg?.role}</div>
              </div>
              <span style={{ opacity: 0.5, fontSize: 10 }}>▾</span>
            </button>
            {orgMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#0a0a0f', border: `1px solid ${colors.borderLight}`, borderRadius: 10, padding: 4, zIndex: 20, boxShadow: '0 8px 16px rgba(0,0,0,0.5)' }}>
                {orgs.map((o) => (
                  <Link key={o.slug} href={`/dashboard/orgs/${o.slug}`} onClick={() => setOrgMenuOpen(false)}
                    style={{ display: 'block', padding: 8, borderRadius: 6, fontSize: 12, color: 'inherit', textDecoration: 'none', background: o.slug === currentOrg?.slug ? '#d946ef22' : 'transparent' }}>
                    {o.name} <span style={{ opacity: 0.5, fontSize: 10 }}>· {o.plan}</span>
                  </Link>
                ))}
                <Link href="/signup" onClick={() => setOrgMenuOpen(false)}
                  style={{ display: 'block', padding: 8, borderRadius: 6, fontSize: 12, color: colors.success, textDecoration: 'none', borderTop: `1px solid ${colors.border}`, marginTop: 4 }}>
                  + Nouvelle org
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, overflow: 'auto' }}>
          {navItems.map((it, i) => {
            const active = it.activeWhen ? it.activeWhen(path) : path === it.href;
            const showSection = expanded && it.section && (i === 0 || navItems[i - 1].section !== it.section);
            return (
              <div key={i}>
                {showSection && (
                  <div style={{ fontSize: 9, opacity: 0.4, padding: '10px 8px 4px', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>{it.section}</div>
                )}
                <Link href={it.href} className="pxs-nav-item"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: expanded ? '8px 10px' : '10px 0',
                    justifyContent: expanded ? 'flex-start' : 'center',
                    borderRadius: 8, fontSize: 13, textDecoration: 'none',
                    color: active ? colors.primary : colors.textMuted,
                    background: active ? '#d946ef15' : 'transparent',
                    fontWeight: active ? 700 : 500,
                  }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>{it.icon}</span>
                  {expanded && <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span>}
                  {!expanded && <span className="pxs-nav-tooltip">{it.label}</span>}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 10, marginTop: 8 }}>
          {user?.isSuperAdmin && (
            <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: expanded ? '8px 10px' : '10px 0', justifyContent: expanded ? 'flex-start' : 'center', fontSize: 13, color: colors.warning, textDecoration: 'none', borderRadius: 6, fontWeight: 700 }}>
              <span style={{ fontSize: 16 }}>👑</span>
              {expanded && 'Super-admin'}
            </Link>
          )}
          <button onClick={toggleExpanded}
            style={{ width: '100%', background: 'transparent', border: 0, color: colors.textDim, fontSize: 12, padding: expanded ? '8px 10px' : '10px 0', cursor: 'pointer', textAlign: expanded ? 'left' : 'center', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10, justifyContent: expanded ? 'flex-start' : 'center' }}>
            <span style={{ fontSize: 14 }}>{expanded ? '◀' : '▶'}</span>
            {expanded && <span>Réduire</span>}
          </button>
          {expanded && (
            <div style={{ fontSize: 10, opacity: 0.5, padding: '4px 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          )}
          <button onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ width: '100%', background: 'transparent', border: 0, color: colors.textDim, fontSize: 13, padding: expanded ? '8px 10px' : '10px 0', cursor: 'pointer', textAlign: expanded ? 'left' : 'center', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10, justifyContent: expanded ? 'flex-start' : 'center' }}>
            <span style={{ fontSize: 14 }}>↩</span>
            {expanded && 'Déconnexion'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="pxs-main" style={{ flex: 1, padding: 24, overflow: 'auto' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
          <div style={{ flex: 1, maxWidth: 720 }}>
            <MegaSearch orgSlug={currentOrg?.slug} />
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
