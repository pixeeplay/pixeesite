'use client';
import { useEffect, useState } from 'react';
import { card } from './SimpleOrgPage';

export function SuperStatsClient() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) return <p style={{ opacity: 0.5 }}>Chargement…</p>;

  const tiles = [
    { label: 'Utilisateurs', value: stats.users, emoji: '👥' },
    { label: 'Organisations', value: stats.orgs, emoji: '🏢' },
    { label: 'Sites publiés', value: stats.sites, emoji: '🌐' },
    { label: 'Abonnements payants', value: stats.paidSubscriptions, emoji: '💳' },
    { label: 'Revenus cumulés', value: `${(stats.revenueCents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`, emoji: '💰' },
    { label: 'Coût IA 30j', value: `${(stats.aiCostCentsLast30 / 100).toFixed(2)} €`, emoji: '🤖' },
    { label: 'Tokens IA 30j', value: stats.aiTokensLast30.toLocaleString(), emoji: '🧠' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>👑 Super-Admin Dashboard</h1>
        <p style={{ opacity: 0.6, fontSize: 13, margin: '4px 0' }}>Vue plateforme — toutes les orgs, tous les users.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {tiles.map((t) => (
          <div key={t.label} style={card}>
            <div style={{ fontSize: 24 }}>{t.emoji}</div>
            <div style={{ fontSize: 11, opacity: 0.5, textTransform: 'uppercase', marginTop: 6 }}>{t.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>{t.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
