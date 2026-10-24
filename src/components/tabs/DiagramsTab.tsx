'use client';

import { useAppStore } from '@/store/useAppStore';
import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function DiagramsTab() {
  const { prdData } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prdData?.mermaidDiagram || !containerRef.current) return;

    let cancelled = false;

    const renderDiagram = async () => {
      try {
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#0F382C',
            primaryTextColor: '#E8EDE9',
            primaryBorderColor: '#D4AF37',
            lineColor: '#D4AF37',
            secondaryColor: '#153D32',
            tertiaryColor: '#09120E',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
          },
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            padding: 16,
          },
        });

        if (cancelled) return;

        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, prdData.mermaidDiagram);

        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = svg;
        setRendered(true);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          console.error('Mermaid render error:', err);
          setError('Failed to render diagram. The Mermaid syntax may need adjustment.');
        }
      }
    };

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [prdData?.mermaidDiagram]);

  if (!prdData) return null;

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
          System Architecture Diagram
        </h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn-icon" title="Refresh diagram" onClick={() => window.location.reload()}>
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Diagram canvas */}
      <div className="mermaid-container" style={{ minHeight: '400px', position: 'relative' }}>
        {!rendered && !error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '400px',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            <RefreshCw size={18} className="animate-spin-slow" style={{ marginRight: '10px' }} />
            Rendering diagram...
          </div>
        )}
        {error && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '400px',
              color: 'var(--error)',
              fontSize: '0.85rem',
              gap: '12px',
            }}
          >
            <p>{error}</p>
          </div>
        )}
        <div
          ref={containerRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
          }}
        />
      </div>

      {/* Mermaid source code */}
      <div>
        <h4
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '8px',
            color: 'var(--text-secondary)',
          }}
        >
          Diagram Source (Mermaid.js)
        </h4>
        <div
          className="surface-card mono"
          style={{
            padding: '20px',
            fontSize: '0.78rem',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            color: 'var(--text-secondary)',
            overflowX: 'auto',
          }}
        >
          {prdData.mermaidDiagram}
        </div>
      </div>
    </div>
  );
}
