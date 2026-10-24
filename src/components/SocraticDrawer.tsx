'use client';

import { useAppStore } from '@/store/useAppStore';
import {
  MessageCircleQuestion,
  Send,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import { useState } from 'react';

function SeverityBadge({ severity }: { severity: 'High' | 'Medium' | 'Low' }) {
  const config = {
    High: { class: 'badge-error', icon: <AlertCircle size={10} /> },
    Medium: { class: 'badge-warning', icon: <AlertTriangle size={10} /> },
    Low: { class: 'badge-info', icon: <Info size={10} /> },
  };
  const { class: cls, icon } = config[severity];
  return (
    <span className={`badge ${cls}`}>
      {icon} {severity}
    </span>
  );
}

export default function SocraticDrawer() {
  const { prdData, answerQuestion, setShowSocratic } = useAppStore();
  const [activeAnswer, setActiveAnswer] = useState<string>('');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  if (!prdData) return null;

  const { socraticQuestions } = prdData;
  const unanswered = socraticQuestions.filter((q) => !q.answered);
  const answered = socraticQuestions.filter((q) => q.answered);

  const handleSubmit = (id: string) => {
    if (!activeAnswer.trim()) return;
    answerQuestion(id, activeAnswer);
    setActiveAnswer('');
    setActiveQuestionId(null);
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
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            <MessageCircleQuestion size={16} color="var(--accent-gold)" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Clarifying Questions</h3>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {unanswered.length} remaining
            </p>
          </div>
        </div>
        <button className="btn-icon" onClick={() => setShowSocratic(false)}>
          <X size={16} />
        </button>
      </div>

      {/* Questions list */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Unanswered */}
        {unanswered.map((q, idx) => (
          <div
            key={q.id}
            className="animate-fade-in"
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg)',
              border:
                activeQuestionId === q.id
                  ? '1px solid var(--accent-gold)'
                  : '1px solid var(--border-subtle)',
              animationDelay: `${idx * 0.05}s`,
              transition: 'border-color var(--transition-fast)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                }}
              >
                {q.id}
              </span>
              <SeverityBadge severity={q.severity} />
            </div>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                marginBottom: '12px',
              }}
            >
              {q.questionForClient}
            </p>

            {activeQuestionId === q.id ? (
              <div className="animate-fade-in">
                <textarea
                  className="textarea-base"
                  value={activeAnswer}
                  onChange={(e) => setActiveAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  style={{
                    minHeight: '80px',
                    fontSize: '0.85rem',
                    marginBottom: '8px',
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      setActiveQuestionId(null);
                      setActiveAnswer('');
                    }}
                    style={{ fontSize: '0.8rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => handleSubmit(q.id)}
                    style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                    disabled={!activeAnswer.trim()}
                  >
                    <Send size={13} />
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="btn-secondary"
                onClick={() => setActiveQuestionId(q.id)}
                style={{ fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}
              >
                Answer this question
              </button>
            )}
          </div>
        ))}

        {/* Answered */}
        {answered.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <p
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 600,
                marginBottom: '8px',
                padding: '0 4px',
              }}
            >
              ✓ Answered
            </p>
            {answered.map((q) => (
              <div
                key={q.id}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg)',
                  border: '1px solid rgba(52, 211, 153, 0.15)',
                  marginBottom: '8px',
                  opacity: 0.8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px',
                  }}
                >
                  <CheckCircle2 size={14} color="var(--success)" />
                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--success)' }}>
                    {q.id}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {q.questionForClient}
                </p>
                <div
                  style={{
                    marginTop: '8px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(52, 211, 153, 0.06)',
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                    borderLeft: '3px solid var(--success)',
                  }}
                >
                  {q.answer}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All answered */}
        {unanswered.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '32px 16px',
            }}
          >
            <CheckCircle2 size={40} color="var(--success)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>All Questions Answered</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Great job! The specification is now more complete.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
