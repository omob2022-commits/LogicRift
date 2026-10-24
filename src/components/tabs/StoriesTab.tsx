'use client';

import { useAppStore } from '@/store/useAppStore';
import { User, Wand2, Heart, CheckSquare, Copy } from 'lucide-react';
import { useState } from 'react';

export default function StoriesTab() {
  const { prdData } = useAppStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!prdData) return null;

  const copyStory = (story: (typeof prdData.userStories)[0]) => {
    const text = `[${story.id}] As a ${story.asA}, I want to ${story.iWantTo}, so that ${story.soThat}\n\nAcceptance Criteria:\n${story.acceptanceCriteria.map((c) => `- ${c}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(story.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}
      >
        <h3 className="heading-section" style={{ fontSize: '1.2rem' }}>
          Agile User Stories
        </h3>
        <span className="badge badge-gold">{prdData.userStories.length} Stories</span>
      </div>

      {prdData.userStories.map((story) => (
        <div
          key={story.id}
          className="surface-card"
          style={{
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Gold accent stripe */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: 'linear-gradient(180deg, var(--accent-gold), var(--accent-gold-hover))',
              borderRadius: '4px 0 0 4px',
            }}
          />

          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                className="mono"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent-gold)',
                  padding: '4px 10px',
                  background: 'var(--accent-gold-dim)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {story.id}
              </span>
              <span className="badge badge-success">Story</span>
            </div>
            <button
              className="btn-icon"
              onClick={() => copyStory(story)}
              title="Copy story"
            >
              {copiedId === story.id ? (
                <CheckSquare size={15} color="var(--success)" />
              ) : (
                <Copy size={15} />
              )}
            </button>
          </div>

          {/* Story body */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(96, 165, 250, 0.08)',
                  color: 'var(--info)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  flexShrink: 0,
                  letterSpacing: '0.03em',
                }}
              >
                <User size={10} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                As a
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.5 }}>
                {story.asA}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-gold-dim)',
                  color: 'var(--accent-gold)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  flexShrink: 0,
                  letterSpacing: '0.03em',
                }}
              >
                <Wand2 size={10} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                I want
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {story.iWantTo}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(52, 211, 153, 0.08)',
                  color: 'var(--success)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  flexShrink: 0,
                  letterSpacing: '0.03em',
                }}
              >
                <Heart size={10} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                So that
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {story.soThat}
              </span>
            </div>
          </div>

          {/* Acceptance Criteria */}
          <div
            style={{
              background: 'var(--bg)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <p
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '10px',
              }}
            >
              Acceptance Criteria (Given/When/Then)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {story.acceptanceCriteria.map((ac, i) => (
                <div
                  key={i}
                  className="mono"
                  style={{
                    fontSize: '0.78rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    paddingLeft: '12px',
                    borderLeft: '2px solid var(--border-gold)',
                  }}
                >
                  {ac}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
