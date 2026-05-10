'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { MegaSearch } from './MegaSearch';

interface Org { slug: string; name: string; plan: string; role: string; }

export function DashboardShell({ user, orgs, children }: { user: any; orgs: Org[]; children: React.ReactNode }) {
  const path = usePathname();
  const currentOrgSlug = path.match(/^\/dashboard\/orgs\/([^/]+)/)?.[1];
  const currentOrg = orgs.find((o) => o.slug === currentOrgSlug) || orgs[0];
  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Auto-close mobile nav on route change
  useEffect(() => { setMobileNavOpen(false); }, [path]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Mobile burger */}
      <button onClick={() => setMobileNavOpen(!mobileNavOpen)}
        className="pxs-burger"
        style={{ position: 'fixed', top: 12, left: 12, zIndex: 60, background: '#18181b', color: 'white', border: '1px solid #27272a', borderRadius: 8, width: 40, height: 40, cursor: 'pointer', fontSize: 18, display: 'none' }}>
        {mobileNavOpen ? '✕' : '☰'}
      </button>
      <style>{`
        @media (max-width: 768px) {
          .pxs-burger { display: block !important; }
          .pxs-sidebar { position: fixed !important; left: ${mobileNavOpen ? '0' : '-260px'} !important; top: 0; bottom: 0; transition: left .25s; z-index: 50; box-shadow: 4px 0 16px rgba(0,0,0,0.5); }
          .pxs-main { padding: 56px 16px 16px !important; }
        }
      `}</style>
      {/* Sidebar */}
      <aside className="pxs-sidebar" style={{ width: 240, background: '#18181b', borderRight: '1px solid #27272a', display: 'flex', flexDirection: 'column', padding: '20px 12px' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit', marginBottom: 24 }}>
          <span style={{ fontSize: 24 }}>🎨</span>
          <span style={{ fontWeight: 900, background: 'linear-gradient(135deg, #d946ef, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pixeesite</span>
        </Link>

        {/* Org switcher */}
        {orgs.length > 0 && (
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <button
              onClick={() => setOrgMenuOpen(!orgMenuOpen)}
              style={{ width: '100%', background: '#27272a', border: '1px solid #3f3f46', borderRadius: 10, padding: 10, color: 'inherit', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #d946ef, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                {currentOrg?.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentOrg?.name}</div>
                <div style={{ fontSize: 10, opacity: 0.5, textTransform: 'uppercase' }}>{currentOrg?.plan} · {currentOrg?.role}</div>
              </div>
              <span style={{ opacity: 0.5 }}>▾</span>
            </button>
            {orgMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#27272a', border: '1px solid #3f3f46', borderRadius: 10, padding: 4, zIndex: 10 }}>
                {orgs.map((o) => (
                  <Link
                    key={o.slug} href={`/dashboard/orgs/${o.slug}`}
                    onClick={() => setOrgMenuOpen(false)}
                    style={{ display: 'block', padding: 8, borderRadius: 6, fontSize: 13, color: 'inherit', textDecoration: 'none', background: o.slug === currentOrg?.slug ? '#d946ef33' : 'transparent' }}
                  >
                    {o.name} <span style={{ opacity: 0.5, fontSize: 11 }}>· {o.plan}</span>
                  </Link>
                ))}
                <Link
                  href="/signup" onClick={() => setOrgMenuOpen(false)}
                  style={{ display: 'block', padding: 8, borderRadius: 6, fontSize: 13, color: '#10b981', textDecoration: 'none', borderTop: '1px solid #3f3f46', marginTop: 4 }}
                >
                  + Nouvelle organisation
                </Link>
              </div>
            )}
          </div>
        )}

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <NavItem href="/dashboard" label="🏠 Accueil" active={path === '/dashboard'} />
          {currentOrg && <>
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}`} label="📁 Sites" active={path === `/dashboard/orgs/${currentOrg.slug}` || path.startsWith(`/dashboard/orgs/${currentOrg.slug}/sites`)} />
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/templates`} label="✨ Templates" active={path.includes('/templates')} />
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/sitemap`} label="🗺️ Sitemap" active={path.endsWith('/sitemap')} />
            <div style={{ fontSize: 10, opacity: 0.4, padding: '12px 8px 4px', textTransform: 'uppercase', letterSpacing: 1 }}>Contenu</div>
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/blog`} label="📝 Blog" active={path.endsWith('/blog')} />
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/newsletter`} label="✉ Newsletter" active={path.includes('/newsletter')} />
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/forms`} label="📋 Formulaires" active={path.endsWith('/forms')} />
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/forum`} label="💬 Forum" active={path.endsWith('/forum')} />
            <div style={{ fontSize: 10, opacity: 0.4, padding: '12px 8px 4px', textTransform: 'uppercase', letterSpacing: 1 }}>Business</div>
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/leads`} label="🎯 Leads" active={path.endsWith('/leads')} />
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/shop`} label="🛒 Boutique" active={path.endsWith('/shop')} />
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/tasks`} label="📋 Tâches" active={path.endsWith('/tasks')} />
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/mail`} label="📨 Webmail" active={path.endsWith('/mail')} />
            <div style={{ fontSize: 10, opacity: 0.4, padding: '12px 8px 4px', textTransform: 'uppercase', letterSpacing: 1 }}>Équipe</div>
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/team`} label="👥 Membres" active={path.endsWith('/team')} />
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/billing`} label="💳 Facturation" active={path.endsWith('/billing')} />
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/domains`} label="🌐 Domaines" active={path.endsWith('/domains')} />
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/security`} label="🔐 Sécurité" active={path.endsWith('/security')} />
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/keys`} label="🔑 Clés API" active={path.endsWith('/keys')} />
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/ai`} label="🤖 IA Settings" active={path.endsWith('/ai')} />
            <NavItem href={`/dashboard/orgs/${currentOrg.slug}/settings`} label="⚙ Paramètres" active={path.endsWith('/settings')} />
          </>}
        </nav>

        <div style={{ borderTop: '1px solid #27272a', paddingTop: 12 }}>
          {user?.isSuperAdmin && (
            <Link href="/admin" style={{ display: 'block', padding: '8px 12px', fontSize: 13, color: '#f59e0b', textDecoration: 'none', borderRadius: 6, fontWeight: 600 }}>
              👑 Super-admin
            </Link>
          )}
          <div style={{ fontSize: 11, opacity: 0.5, padding: '6px 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ width: '100%', background: 'transparent', border: 0, color: '#a1a1aa', fontSize: 13, padding: 8, cursor: 'pointer', textAlign: 'left', borderRadius: 6 }}
          >
            ↩ Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="pxs-main" style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <MegaSearch orgSlug={currentOrg?.slug} />
        </div>
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block', padding: '8px 12px', borderRadius: 8, fontSize: 14, textDecoration: 'none',
        color: active ? '#d946ef' : '#a1a1aa',
        background: active ? '#d946ef15' : 'transparent',
        fontWeight: active ? 600 : 400,
      }}
    >{label}</Link>
  );
}
