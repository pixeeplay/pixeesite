'use client';
/**
 * KnowledgeAdminClient — Cerveau RAG multi-tenant.
 * Port faithful de GLD/src/components/admin/KnowledgeAdmin.tsx, adapté Pixeesite.
 */
import { useEffect, useState, useMemo } from 'react';
import { SimpleOrgPage, card, input, btnPrimary, btnSecondary } from './SimpleOrgPage';
import { colors, gradients } from '@/lib/design-tokens';

type Source = {
  id: string;
  name: string;
  type: string;
  url: string | null;
  config: any;
  lastIndexedAt: string | null;
  chunksCount: number;
  tokensCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type Tab = 'library' | 'add' | 'playground';

const SOURCE_TYPES = [
  { id: 'text', label: 'Texte libre', emoji: '📝' },
  { id: 'url', label: 'URL', emoji: '🔗' },
  { id: 'pdf', label: 'PDF (texte)', emoji: '📄' },
];

export function KnowledgeAdminClient({ orgSlug }: { orgSlug: string }) {
  const [tab, setTab] = useState<Tab>('library');
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`/api/orgs/${orgSlug}/rag-sources`);
      const j = await r.json();
      setSources(j.items || []);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [orgSlug]);

  const stats = useMemo(() => ({
    sourceCount: sources.length,
    activeCount: sources.filter((s) => s.active).length,
    chunkCount: sources.reduce((s, x) => s + (x.chunksCount || 0), 0),
    tokenCount: sources.reduce((s, x) => s + (x.tokensCount || 0), 0),
  }), [sources]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sources;
    return sources.filter((s) => (s.name + ' ' + (s.url || '') + ' ' + s.type).toLowerCase().includes(q));
  }, [sources, search]);

  return (
    <SimpleOrgPage orgSlug={orgSlug} emoji="🧠" title="Cerveau RAG" desc="Knowledge base sémantique avec embeddings Gemini text-embedding-004 (768 dim).">
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8, marginBottom: 16 }}>
        <Stat label="Sources" value={stats.sourceCount} sub={`${stats.activeCount} actives`} grad={gradients.purple} />
        <Stat label="Chunks indexés" value={stats.chunkCount} sub="passages cherchables" grad={gradients.blue} />
        <Stat label="Tokens ≈" value={stats.tokenCount} sub="poids cumul" grad={gradients.pink} />
        <Stat label="État" value={stats.chunkCount > 0 ? 'Prêt' : 'Vide'} sub={stats.chunkCount > 0 ? 'recherche active' : 'rien à chercher'} grad={gradients.green} />
      </section>

      <nav style={{ ...card, display: 'flex', gap: 8, marginBottom: 16, padding: 8, flexWrap: 'wrap' }}>
        <TabBtn active={tab === 'library'} onClick={() => setTab('library')} label={`📚 Bibliothèque (${stats.sourceCount})`} />
        <TabBtn active={tab === 'add'} onClick={() => setTab('add')} label="➕ Ajouter du contenu" />
        <TabBtn active={tab === 'playground'} onClick={() => setTab('playground')} label="💬 Playground" />
      </nav>

      {tab === 'library' && (
        <LibraryView sources={filtered} loading={loading} search={search} setSearch={setSearch} orgSlug={orgSlug} onReload={load} />
      )}
      {tab === 'add' && <AddView orgSlug={orgSlug} onAdded={() => { setTab('library'); load(); }} />}
      {tab === 'playground' && <PlaygroundView orgSlug={orgSlug} />}
    </SimpleOrgPage>
  );
}

/* ---------- Library ---------- */
function LibraryView({ sources, loading, search, setSearch, orgSlug, onReload }: {
  sources: Source[]; loading: boolean; search: string; setSearch: (s: string) => void; orgSlug: string; onReload: () => void;
}) {
  const [reindexing, setReindexing] = useState<string | null>(null);

  async function toggleActive(s: Source) {
    await fetch(`/api/orgs/${orgSlug}/rag-sources/${s.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !s.active }),
    });
    onReload();
  }
  async function remove(s: Source) {
    if (!confirm(`Supprimer "${s.name}" ?`)) return;
    await fetch(`/api/orgs/${orgSlug}/rag-sources/${s.id}`, { method: 'DELETE' });
    onReload();
  }
  async function reindex(s: Source) {
    if (s.type !== 'url') { alert('Pour réindexer un texte/PDF, supprime + ré-ajoute.'); return; }
    setReindexing(s.id);
    try {
      const r = await fetch(`/api/orgs/${orgSlug}/rag-sources/${s.id}/reindex`, { method: 'POST' });
      const j = await r.json();
      if (!r.ok) alert(`Erreur: ${j.error}`); else alert(`✓ ${j.chunkCount} chunks réindexés`);
      onReload();
    } finally { setReindexing(null); }
  }

  return (
    <div>
      <input placeholder="🔍 Filtrer par nom, URL, type…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...input, marginBottom: 12 }} />
      {loading ? <p style={{ opacity: 0.5 }}>Chargement…</p>
        : sources.length === 0 ? (
          <div style={{ ...card, textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 48 }}>🗃️</div>
            <p style={{ opacity: 0.6 }}>Aucune source. Va dans l'onglet « Ajouter ».</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {sources.map((s) => (
              <article key={s.id} style={{ ...card, padding: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ fontSize: 28 }}>{SOURCE_TYPES.find((t) => t.id === s.type)?.emoji || '📄'}</div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    {s.name}
                    {!s.active && <span style={pill(colors.danger)}>OFF</span>}
                    <span style={pill(colors.secondary)}>{s.type.toUpperCase()}</span>
                  </div>
                  {s.url && <a href={s.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, opacity: 0.6 }}>{s.url}</a>}
                  <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>
                    {s.chunksCount} chunks · {s.tokensCount} tokens · {s.lastIndexedAt ? `indexé ${new Date(s.lastIndexedAt).toLocaleString()}` : 'jamais indexé'}
                  </div>
                </div>
                {s.type === 'url' && (
                  <button onClick={() => reindex(s)} disabled={reindexing === s.id} style={{ ...btnSecondary, padding: '6px 10px', fontSize: 12 }}>
                    {reindexing === s.id ? '⏳' : '↻ Reindex'}
                  </button>
                )}
                <button onClick={() => toggleActive(s)} style={{ ...btnSecondary, padding: '6px 10px', fontSize: 12 }}>
                  {s.active ? '◉ Désactiver' : '◯ Activer'}
                </button>
                <button onClick={() => remove(s)} style={{ ...btnSecondary, padding: '6px 8px', fontSize: 12, color: colors.danger }}>×</button>
              </article>
            ))}
          </div>
        )}
    </div>
  );
}

/* ---------- Add ---------- */
function AddView({ orgSlug, onAdded }: { orgSlug: string; onAdded: () => void }) {
  const [type, setType] = useState('text');
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    if (!name.trim()) { setMsg('Nom requis'); return; }
    if (type !== 'url' && !content.trim()) { setMsg('Contenu requis'); return; }
    if (type === 'url' && !url.trim()) { setMsg('URL requise'); return; }
    setBusy(true); setMsg('Indexation en cours (peut prendre une minute)…');
    try {
      const r = await fetch(`/api/orgs/${orgSlug}/rag-sources`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, content: type === 'url' ? '' : content, url: type === 'url' ? url : null }),
      });
      const j = await r.json();
      if (!r.ok) { setMsg(`Erreur: ${j.error}`); return; }
      setMsg(`✓ ${j.chunkCount} chunks indexés (${j.tokensCount} tokens)`);
      setTimeout(onAdded, 800);
    } finally { setBusy(false); }
  }

  return (
    <div style={{ ...card, padding: 20 }}>
      <h3 style={{ marginTop: 0 }}>Ajouter une nouvelle source</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8, marginBottom: 16 }}>
        {SOURCE_TYPES.map((t) => (
          <button key={t.id} onClick={() => setType(t.id)} style={{
            ...card, padding: 14, cursor: 'pointer', textAlign: 'center',
            border: type === t.id ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
            background: type === t.id ? `${colors.primary}11` : colors.bgCard,
          }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{t.emoji}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{t.label}</div>
          </button>
        ))}
      </div>

      <Field label="Nom de la source *">
        <input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: CGV 2026, FAQ équipe…" />
      </Field>

      {type === 'url' ? (
        <Field label="URL à indexer *">
          <input style={input} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" type="url" />
        </Field>
      ) : (
        <Field label="Contenu *">
          <textarea style={{ ...input, minHeight: 220, fontFamily: 'inherit' }} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Colle ici le texte à indexer (Markdown ou texte brut)…" />
          <div style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>
            {content.length} chars ≈ {Math.round(content.length / 4)} tokens · sera découpé en chunks de ~220 mots
          </div>
        </Field>
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
        <button style={btnPrimary} disabled={busy} onClick={submit}>{busy ? '⏳ Indexation…' : '⚡ Indexer'}</button>
        {msg && <span style={{ fontSize: 12, opacity: 0.8 }}>{msg}</span>}
      </div>
    </div>
  );
}

/* ---------- Playground ---------- */
function PlaygroundView({ orgSlug }: { orgSlug: string }) {
  const [query, setQuery] = useState('');
  const [generate, setGenerate] = useState(true);
  const [topK, setTopK] = useState(5);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function run() {
    if (!query.trim()) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/orgs/${orgSlug}/rag-search`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, topK, generateAnswer: generate }),
      });
      const j = await r.json();
      setResult(j);
    } finally { setBusy(false); }
  }

  return (
    <div style={{ ...card, padding: 20 }}>
      <h3 style={{ marginTop: 0 }}>Test de recherche sémantique</h3>
      <Field label="Ta question / requête">
        <textarea style={{ ...input, minHeight: 80 }} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Que dit ma documentation sur X ?" />
      </Field>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', gap: 6, fontSize: 13 }}>
          <span>Top-K :</span>
          <input type="number" min={1} max={20} value={topK} onChange={(e) => setTopK(parseInt(e.target.value || '5'))} style={{ ...input, width: 60, padding: 6 }} />
        </label>
        <label style={{ display: 'flex', gap: 6, fontSize: 13, alignItems: 'center' }}>
          <input type="checkbox" checked={generate} onChange={(e) => setGenerate(e.target.checked)} />
          <span>Générer une réponse synthétique (Gemini)</span>
        </label>
        <button style={btnPrimary} disabled={busy} onClick={run}>{busy ? '⏳…' : '🔍 Chercher'}</button>
      </div>

      {result && (
        <div style={{ marginTop: 12 }}>
          {result.error && <div style={{ ...card, padding: 10, color: colors.danger }}>Erreur: {result.error}</div>}
          {result.answer && (
            <div style={{ ...card, padding: 14, marginBottom: 12, borderLeft: `3px solid ${colors.success}` }}>
              <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>💬 RÉPONSE SYNTHÉTISÉE</div>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{result.answer}</div>
            </div>
          )}
          <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6 }}>
            {result.chunks?.length || 0} chunks · top score {result.topScore?.toFixed(3)}
          </div>
          {(result.chunks || []).map((c: any, i: number) => (
            <div key={c.chunkId} style={{ ...card, padding: 12, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
                <span>[{i + 1}] {c.sourceName}</span>
                <span>score {c.score.toFixed(4)}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.9 }}>{c.text.slice(0, 600)}{c.text.length > 600 ? '…' : ''}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */
function Stat({ label, value, sub, grad }: { label: string; value: number | string; sub?: string; grad: string }) {
  return (
    <div style={{ ...card, padding: 14, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: grad, opacity: 0.07 }} />
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 11, opacity: 0.6, textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 800, margin: '2px 0' }}>{value}</div>
        {sub && <div style={{ fontSize: 11, opacity: 0.5 }}>{sub}</div>}
      </div>
    </div>
  );
}
function TabBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
      border: active ? `1px solid ${colors.primary}` : `1px solid transparent`,
      background: active ? `${colors.primary}22` : 'transparent', color: 'inherit',
    }}>{label}</button>
  );
}
function Field({ label, children }: { label: string; children: any }) {
  return <label style={{ display: 'block', marginBottom: 12 }}><div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>{children}</label>;
}
function pill(c: string): React.CSSProperties {
  return { background: `${c}22`, color: c, padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' };
}
