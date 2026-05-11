import Link from 'next/link';
import { colors, gradients, shadows, radii } from '@/lib/design-tokens';

export const metadata = {
  title: 'Pixeesite — Le site builder AI-first européen',
  description: 'Crée ton site web en 5 minutes avec l\'IA. Templates pro, Page Builder drag&drop, e-commerce, blog, forum, newsletter. Self-hostable, RGPD, made in EU.',
};

// ── DATA ─────────────────────────────────────────────────────────────────

const HERO = {
  badge: '🚀 Beta 2026 — code source ouvert (BUSL)',
  title: 'Construis ton site',
  titleAccent: 'avec une IA qui comprend ton business',
  desc: '5 minutes pour créer un site complet : pages, blog, forum, boutique, formulaires, newsletter. L\'IA personnalise chaque bloc selon ton métier. 100% RGPD, hébergeable où tu veux.',
};

const STATS = [
  { value: '106', label: 'Templates', icon: '✨', gradient: gradients.purple },
  { value: '50+', label: 'Effets visuels', icon: '🎨', gradient: gradients.blue },
  { value: '12', label: 'Providers IA', icon: '🤖', gradient: gradients.pink },
  { value: '∞', label: 'Sites par org', icon: '🚀', gradient: gradients.green },
];

const FEATURES = [
  { icon: '🪄', title: 'Studio IA', desc: 'Génère un thème complet (couleurs, polices, hero, pages) depuis une simple description de ton business.', color: '#d946ef' },
  { icon: '🎨', title: 'Page Builder drag & drop', desc: 'Compose tes pages bloc par bloc : parallax hero, sliders, galleries, formulaires, CTAs animés.', color: '#06b6d4' },
  { icon: '✨', title: '106 templates pro', desc: 'Photo, restau, SaaS, association, podcast, école, agence, immobilier, e-commerce, blog, link-in-bio.', color: '#8b5cf6' },
  { icon: '🤖', title: 'Claude Autopilot', desc: 'Décris ce que tu veux, Claude code et déploie automatiquement. Workspace VS Code en ligne intégré.', color: '#ec4899' },
  { icon: '🛒', title: 'E-commerce intégré', desc: 'Boutique, produits, commandes, paiement Stripe, dropshipping. Plus de plug-in à installer.', color: '#10b981' },
  { icon: '📝', title: 'Blog & Forum', desc: 'Articles SEO-friendly + forum avec modération IA Telegram. Multi-auteurs, multi-catégories.', color: '#3b82f6' },
  { icon: '📬', title: 'Newsletter & CRM', desc: 'Éditeur newsletter visuel, segmentation, A/B testing, leads scraping multi-source.', color: '#f59e0b' },
  { icon: '🌍', title: 'Multi-domaines + SSL auto', desc: 'Connecte ton domaine perso, certificat HTTPS automatique. Plusieurs sites par org.', color: '#06b6d4' },
  { icon: '🛡️', title: 'RGPD + 2FA TOTP', desc: 'Hébergé en Europe, conforme RGPD. 2FA, SSO, audit logs, secrets chiffrés AES-256.', color: '#ef4444' },
  { icon: '🔌', title: 'Self-hostable', desc: 'Licence BUSL : pose-le sur ton serveur, Docker compose en 5 min. Tu possèdes tes données.', color: '#8b5cf6' },
  { icon: '🎬', title: 'Vidéo & image IA', desc: 'Seedance, Veo, Flux, Kling, HeyGen avatars. Génère du contenu directement dans le builder.', color: '#d946ef' },
  { icon: '🌐', title: 'i18n 30 langues', desc: 'Traduction auto IA, gestion multi-langue, sitemap par langue, hreflang automatique.', color: '#10b981' },
];

const DEMO_STEPS = [
  { step: 1, emoji: '📝', title: 'Brief', desc: 'Décris ton activité en 2 phrases' },
  { step: 2, emoji: '👥', title: 'Audience', desc: 'Cible + ton de voix' },
  { step: 3, emoji: '🎨', title: 'Style', desc: 'Couleur, police, logo' },
  { step: 4, emoji: '⚙️', title: 'Modules', desc: 'Blog, shop, forum, contact' },
  { step: 5, emoji: '🚀', title: 'Génération live', desc: 'L\'IA personnalise chaque page' },
];

const PRICING = [
  { plan: 'Free', price: '0', desc: 'Pour découvrir', highlight: false, items: ['1 site', '50 pages', 'Sous-domaine pixeeplay.com', '1 000 crédits IA / mois', 'Communauté'] },
  { plan: 'Solo', price: '12', desc: 'Freelance / perso', highlight: false, items: ['3 sites', '200 pages / site', '1 domaine personnalisé', '10 000 crédits IA', 'Support email'] },
  { plan: 'Pro', price: '39', desc: 'Petites entreprises', highlight: true, items: ['10 sites', '∞ pages', '5 domaines + SSL auto', '50 000 crédits IA', 'E-commerce + Stripe', 'Multi-langue', 'Support prioritaire'] },
  { plan: 'Agency', price: '149', desc: 'Agences web', highlight: false, items: ['∞ sites', '∞ pages', '∞ domaines', '500 000 crédits IA', 'White-label complet', 'Multi-équipe + rôles', 'API + webhooks', 'SLA 99.9 %'] },
  { plan: 'Enterprise', price: 'sur devis', desc: 'Grands comptes', highlight: false, items: ['Tout Agency', 'Self-hosted on-prem', 'SAML / SCIM', 'SLA garanti', 'Manager dédié', 'Migration assistée'] },
];

const TESTIMONIALS = [
  { name: 'Léa Martin', role: 'Photographe mariage', quote: 'En 4 minutes mon site était en ligne. L\'IA a même rédigé mes textes mieux que moi.', emoji: '📸' },
  { name: 'Karim El-A.', role: 'Restaurateur', quote: 'J\'ai remplacé Squarespace + Mailchimp + Shopify d\'un coup. Et ça coûte 1/4 du prix.', emoji: '🍽' },
  { name: 'Studio Pixelle', role: 'Agence web (12 clients)', quote: 'White-label parfait. On livre 3× plus vite, les clients sont bluffés par les effets.', emoji: '🎨' },
];

// ── PAGE ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main style={{ background: colors.bg, color: colors.text, minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: gradients.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✨</span>
            <span style={{ fontWeight: 800, fontSize: 18, background: gradients.brand, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pixeesite</span>
          </Link>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', fontSize: 13 }}>
            <a href="#features" style={{ color: colors.textMuted, textDecoration: 'none' }}>Fonctions</a>
            <a href="#pricing" style={{ color: colors.textMuted, textDecoration: 'none' }}>Prix</a>
            <a href="#demo" style={{ color: colors.textMuted, textDecoration: 'none' }}>Démo</a>
            <Link href="/login" style={{ color: colors.textMuted, textDecoration: 'none' }}>Connexion</Link>
            <Link href="/signup" style={{ background: gradients.brand, color: 'white', padding: '8px 16px', borderRadius: 999, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(217,70,239,0.4)' }}>Essai gratuit →</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px 60px' }}>
        {/* Gradient orbs background */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.35 }}>
          <div style={{ position: 'absolute', top: -100, left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #d946ef 0%, transparent 60%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', top: 100, right: '5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, #06b6d4 0%, transparent 60%)', filter: 'blur(50px)' }} />
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: gradients.bannerSoft, border: `1px solid ${colors.borderLight}`, fontSize: 12, fontWeight: 600, marginBottom: 24 }}>
            {HERO.badge}
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 7vw, 76px)', fontWeight: 900, lineHeight: 1.05, margin: 0, letterSpacing: -1 }}>
            {HERO.title}<br />
            <span style={{ background: gradients.brand, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{HERO.titleAccent}</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 1.6vw, 19px)', opacity: 0.78, maxWidth: 720, margin: '24px auto 0', lineHeight: 1.55 }}>
            {HERO.desc}
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ background: gradients.brand, color: 'white', padding: '14px 28px', borderRadius: 999, fontWeight: 700, textDecoration: 'none', fontSize: 15, boxShadow: '0 8px 30px rgba(217,70,239,0.4)' }}>
              🚀 Essayer 14 jours
            </Link>
            <a href="#demo" style={{ background: colors.bgCard, color: colors.text, border: `1px solid ${colors.borderLight}`, padding: '14px 28px', borderRadius: 999, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>
              ▶ Voir la démo
            </a>
          </div>
          <div style={{ marginTop: 18, fontSize: 12, opacity: 0.5 }}>Sans carte bancaire · Annulable en 1 clic · 100% RGPD</div>

          {/* Stats grid sous le hero */}
          <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ background: s.gradient, borderRadius: radii.lg, padding: 18, color: 'white', boxShadow: shadows.md, position: 'relative', overflow: 'hidden', minHeight: 110, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 22, opacity: 0.9 }}>{s.icon}</div>
                <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, marginTop: 4 }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.95, marginTop: 'auto' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 24px', borderTop: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: colors.primary, opacity: 0.8 }}>Tout-en-un</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: '8px 0 12px', letterSpacing: -0.5 }}>
              Une plateforme. <span style={{ background: gradients.brand, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Zéro plug-in.</span>
            </h2>
            <p style={{ fontSize: 16, opacity: 0.7, maxWidth: 620, margin: '0 auto' }}>Tout ce dont t'as besoin pour faire vivre ton site, sans empiler 12 outils.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: radii.lg, padding: 22, transition: 'transform .2s, border-color .2s' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}22`, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px' }}>{f.title}</h3>
                <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" style={{ padding: '80px 24px', borderTop: `1px solid ${colors.border}`, background: 'linear-gradient(180deg, transparent 0%, rgba(217,70,239,0.04) 50%, transparent 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: colors.secondary, opacity: 0.85 }}>Démo en 5 étapes</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: '8px 0 12px', letterSpacing: -0.5 }}>
              De zéro à site live en <span style={{ background: gradients.brand, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>5 minutes</span>
            </h2>
            <p style={{ fontSize: 15, opacity: 0.7 }}>Le wizard IA gère tout : design, contenu, structure, déploiement.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {DEMO_STEPS.map((d, i) => (
              <div key={d.step} style={{ position: 'relative', background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: radii.lg, padding: 18, textAlign: 'center' }}>
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: gradients.brand, color: 'white', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, boxShadow: '0 4px 10px rgba(217,70,239,0.4)' }}>{d.step}</div>
                <div style={{ fontSize: 32, marginTop: 12, marginBottom: 8 }}>{d.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{d.title}</div>
                <div style={{ fontSize: 12, opacity: 0.6, lineHeight: 1.4 }}>{d.desc}</div>
                {i < DEMO_STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: '50%', right: -8, transform: 'translateY(-50%)', color: colors.borderLight, fontSize: 20, display: 'none' }} className="step-arrow">→</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 36, textAlign: 'center' }}>
            <Link href="/signup" style={{ background: gradients.brand, color: 'white', padding: '14px 32px', borderRadius: 999, fontWeight: 700, textDecoration: 'none', fontSize: 15, boxShadow: '0 8px 30px rgba(217,70,239,0.4)' }}>
              🪄 Lancer le wizard →
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '80px 24px', borderTop: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: colors.success, opacity: 0.85 }}>Tarifs simples</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: '8px 0 12px', letterSpacing: -0.5 }}>
              Choisis ton <span style={{ background: gradients.brand, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>plan</span>
            </h2>
            <p style={{ fontSize: 15, opacity: 0.7 }}>Annulable en 1 clic, sans engagement. Tous les prix HT en €/mois.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {PRICING.map((p) => (
              <div key={p.plan} style={{
                position: 'relative',
                background: p.highlight ? gradients.brand : colors.bgCard,
                border: p.highlight ? 'none' : `1px solid ${colors.border}`,
                borderRadius: radii.lg, padding: 22,
                color: p.highlight ? 'white' : 'inherit',
                boxShadow: p.highlight ? '0 20px 40px rgba(217,70,239,0.3)' : shadows.sm,
                transform: p.highlight ? 'scale(1.03)' : 'scale(1)',
              }}>
                {p.highlight && (
                  <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'white', color: colors.primary, fontSize: 10, fontWeight: 800, letterSpacing: 1, padding: '4px 12px', borderRadius: 999, textTransform: 'uppercase' }}>Populaire</div>
                )}
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', opacity: p.highlight ? 0.9 : 0.55 }}>{p.plan}</div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>{p.price.match(/^\d/) ? `€${p.price}` : p.price}</span>
                  {p.price.match(/^\d/) && <span style={{ fontSize: 12, opacity: 0.7 }}>/mois</span>}
                </div>
                <div style={{ fontSize: 13, opacity: p.highlight ? 0.85 : 0.6, marginTop: 4, marginBottom: 16 }}>{p.desc}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.items.map((it) => (
                    <li key={it} style={{ display: 'flex', gap: 6, fontSize: 13, lineHeight: 1.4 }}>
                      <span style={{ color: p.highlight ? 'white' : colors.success }}>✓</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" style={{
                  display: 'block', textAlign: 'center', padding: '11px 0', borderRadius: radii.md, fontWeight: 700, fontSize: 13, textDecoration: 'none',
                  background: p.highlight ? 'white' : gradients.brand, color: p.highlight ? colors.primary : 'white',
                }}>
                  Commencer {p.plan}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 24px', borderTop: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: colors.pink, opacity: 0.85 }}>Ils utilisent Pixeesite</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, margin: '8px 0 12px', letterSpacing: -0.5 }}>
              Ça parle <span style={{ background: gradients.brand, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>en bien</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: radii.lg, padding: 22 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{t.emoji}</div>
                <p style={{ fontSize: 15, lineHeight: 1.55, fontStyle: 'italic', margin: '0 0 14px' }}>"{t.quote}"</p>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '80px 24px', borderTop: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', background: gradients.banner, borderRadius: radii.xl, padding: 'clamp(40px, 6vw, 60px)', textAlign: 'center', boxShadow: shadows.lg, position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <h2 style={{ position: 'relative', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: 'white', margin: '0 0 12px', letterSpacing: -0.5 }}>
            Prêt à lancer ton site ?
          </h2>
          <p style={{ position: 'relative', fontSize: 16, color: 'rgba(255,255,255,0.9)', margin: '0 auto 28px', maxWidth: 540, lineHeight: 1.5 }}>
            14 jours d'essai gratuit. Aucune carte. L'IA fait 90 % du travail.
          </p>
          <div style={{ position: 'relative', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ background: 'white', color: colors.primary, padding: '14px 32px', borderRadius: 999, fontWeight: 800, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
              🚀 Créer mon compte
            </Link>
            <Link href="/login" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '14px 32px', borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: 'none', backdropFilter: 'blur(10px)' }}>
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 24px 60px', borderTop: `1px solid ${colors.border}`, marginTop: 60 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: gradients.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✨</span>
            <span style={{ fontWeight: 700, fontSize: 14, background: gradients.brand, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pixeesite</span>
            <span style={{ fontSize: 11, opacity: 0.5, marginLeft: 8 }}>© 2026 Pixeeplay</span>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, opacity: 0.6 }}>
            <Link href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Connexion</Link>
            <Link href="/signup" style={{ color: 'inherit', textDecoration: 'none' }}>Inscription</Link>
            <a href="https://github.com/pixeeplay/pixeesite" target="_blank" rel="noopener" style={{ color: 'inherit', textDecoration: 'none' }}>GitHub</a>
            <span>🇪🇺 Hébergé en France</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
