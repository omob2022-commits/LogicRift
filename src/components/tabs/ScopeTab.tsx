'use client';

import { useAppStore } from '@/store/useAppStore';
import {
  Shield,
  Gauge,
  TrendingUp,
  Ban,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export default function ScopeTab() {
  const { prdData } = useAppStore();
  if (!prdData) return null;

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Executive Summary */}
      <section>
        <h3 className="heading-section" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>
          Executive Summary
        </h3>
        <div
          className="surface-card"
          style={{
            padding: '20px',
            lineHeight: 1.7,
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
          }}
        >
          {prdData.executiveSummary}
        </div>
      </section>

      {/* Functional Requirements */}
      <section>
        <h3 className="heading-section" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>
          Functional Requirements
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {prdData.functionalRequirements.map((req, i) => (
            <div
              key={i}
              className="surface-card"
              style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.875rem',
              }}
            >
              <CheckCircle
                size={16}
                color="var(--success)"
                style={{ marginTop: '2px', flexShrink: 0 }}
              />
              <span style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>{req}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Non-Functional Requirements */}
      <section>
        <h3 className="heading-section" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>
          Non-Functional Requirements
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '12px',
          }}
        >
          {[
            {
              label: 'Performance',
              value: prdData.nonFunctionalRequirements.performance,
              icon: <Gauge size={18} color="var(--accent-gold)" />,
              color: 'var(--accent-gold)',
            },
            {
              label: 'Security',
              value: prdData.nonFunctionalRequirements.security,
              icon: <Shield size={18} color="var(--info)" />,
              color: 'var(--info)',
            },
            {
              label: 'Scalability',
              value: prdData.nonFunctionalRequirements.scalability,
              icon: <TrendingUp size={18} color="var(--success)" />,
              color: 'var(--success)',
            },
          ].map((nfr) => (
            <div key={nfr.label} className="surface-card" style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: `${nfr.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {nfr.icon}
                </div>
                <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{nfr.label}</h4>
              </div>
              <p
                className="mono"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                }}
              >
                {nfr.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Out of Scope */}
      <section>
        <h3
          className="heading-section"
          style={{
            fontSize: '1.2rem',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Ban size={18} color="var(--error)" />
          Out of Scope
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {prdData.outOfScope.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px solid rgba(248, 113, 113, 0.12)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.875rem',
              }}
            >
              <AlertTriangle
                size={16}
                color="var(--error)"
                style={{ marginTop: '2px', flexShrink: 0 }}
              />
              <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
