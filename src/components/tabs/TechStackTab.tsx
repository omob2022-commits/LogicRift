'use client';

import { useAppStore } from '@/store/useAppStore';
import {
  Monitor,
  Server,
  Database,
  Cloud,
  CreditCard,
  Map,
  Activity,
  BarChart3,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  frontend: <Monitor size={18} />,
  backend: <Server size={18} />,
  database: <Database size={18} />,
  infrastructure: <Cloud size={18} />,
  payments: <CreditCard size={18} />,
  maps: <Map size={18} />,
  monitoring: <Activity size={18} />,
  analytics: <BarChart3 size={18} />,
};

const CATEGORY_COLORS: Record<string, string> = {
  frontend: '#60A5FA',
  backend: '#34D399',
  database: '#FBBF24',
  infrastructure: '#A78BFA',
  payments: '#F87171',
  maps: '#FB923C',
  monitoring: '#2DD4BF',
  analytics: '#818CF8',
};

function parseCategory(rec: string): { category: string; label: string; details: string } {
  const colonIndex = rec.indexOf(':');
  if (colonIndex === -1) return { category: 'other', label: rec, details: '' };
  const label = rec.substring(0, colonIndex).trim();
  const details = rec.substring(colonIndex + 1).trim();
  const categoryKey = label.toLowerCase().replace(/[^a-z]/g, '');

  for (const key of Object.keys(CATEGORY_ICONS)) {
    if (categoryKey.includes(key)) return { category: key, label, details };
  }
  return { category: 'other', label, details };
}

export default function TechStackTab() {
  const { prdData } = useAppStore();
  if (!prdData) return null;

  const parsed = prdData.techStackRecommendations.map(parseCategory);

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3 className="heading-section" style={{ fontSize: '1.2rem' }}>
          Recommended Technology Stack
        </h3>
        <span className="badge badge-gold">{prdData.techStackRecommendations.length} Categories</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '12px',
        }}
      >
        {parsed.map((item, i) => {
          const color = CATEGORY_COLORS[item.category] || 'var(--accent-gold)';
          const icon = CATEGORY_ICONS[item.category] || <Server size={18} />;

          return (
            <div
              key={i}
              className="surface-card"
              style={{
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top color accent */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${color}, transparent)`,
                }}
              />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <h4
                    style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      marginBottom: '6px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {item.label}
                  </h4>
                  <p
                    className="mono"
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    {item.details}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Architecture note */}
      <div
        style={{
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--accent-gold-dim)',
          border: '1px solid var(--border-gold)',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: 'var(--accent-gold)' }}>⚡ Architecture Note:</strong> This stack
        recommendation is optimized for a production-grade MVP. The event-driven microservice
        pattern allows independent scaling and deployment of each service. Consider starting with a
        modular monolith for faster initial development, then extracting services as traffic patterns
        become clearer.
      </div>
    </div>
  );
}
