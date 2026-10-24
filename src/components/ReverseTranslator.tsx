'use client';

import { useAppStore } from '@/store/useAppStore';
import {
  ArrowLeftRight,
  Loader2,
  Sparkles,
  Copy,
  CheckSquare,
} from 'lucide-react';
import { useState } from 'react';

const SAMPLE_TECH_INPUT = `Sprint 14 Update: We refactored the ORM layer to use query batching with DataLoader, reducing N+1 queries by 85%. Implemented Redis pub/sub for real-time inventory sync with 2ms average propagation latency. The CI/CD pipeline now runs parallel matrix builds across Node 18/20/22, cutting deploy time from 12min to 4min. We also migrated auth from session-based to JWT with refresh token rotation and added PKCE flow for the mobile OAuth integration. Database migrations for the new polymorphic associations on the orders table are staged behind a feature flag.`;

export default function ReverseTranslator() {
  const {
    reverseInput,
    setReverseInput,
    reverseOutput,
    isReverseTranslating,
    translateReverse,
  } = useAppStore();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(reverseOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="animate-slide-right"
      style={{
        borderLeft: '1px solid var(--border-subtle)',
        background: 'var(--bg-elevated)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-gold-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeftRight size={16} color="var(--accent-gold)" />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Reverse Translator</h3>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Engineer → Client language
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Input */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
              }}
            >
              Technical Input
            </label>
            <button
              className="btn-ghost"
              style={{ fontSize: '0.7rem', padding: '4px 8px' }}
              onClick={() => setReverseInput(SAMPLE_TECH_INPUT)}
            >
              <Sparkles size={11} />
              Try sample
            </button>
          </div>
          <textarea
            className="textarea-base mono"
            value={reverseInput}
            onChange={(e) => setReverseInput(e.target.value)}
            placeholder="Paste your technical status update, sprint report, or engineering jargon here..."
            style={{
              minHeight: '150px',
              fontSize: '0.8rem',
              lineHeight: 1.7,
            }}
          />
        </div>

        <button
          className="btn-primary"
          onClick={translateReverse}
          disabled={!reverseInput.trim() || isReverseTranslating}
          style={{
            width: '100%',
            justifyContent: 'center',
            opacity: !reverseInput.trim() || isReverseTranslating ? 0.5 : 1,
          }}
        >
          {isReverseTranslating ? (
            <>
              <Loader2 size={15} className="animate-spin-slow" />
              Translating...
            </>
          ) : (
            <>
              <ArrowLeftRight size={15} />
              Translate to Client Language
            </>
          )}
        </button>

        {/* Output */}
        {reverseOutput && (
          <div className="animate-fade-in">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--success)',
                }}
              >
                ✓ Client-Friendly Summary
              </label>
              <button
                className="btn-icon"
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckSquare size={14} color="var(--success)" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
            <div
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg)',
                border: '1px solid rgba(52, 211, 153, 0.15)',
                fontSize: '0.85rem',
                lineHeight: 1.8,
                color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {reverseOutput}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
