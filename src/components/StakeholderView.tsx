'use client';

import { useAppStore } from '@/store/useAppStore';
import {
  Send,
  Mic,
  Upload,
  FileText,
  Loader2,
  Sparkles,
  MessageCircleQuestion,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState, useRef } from 'react';
import SocraticDrawer from './SocraticDrawer';

const PRESET_SCENARIOS = [
  {
    label: 'E-Commerce Platform',
    icon: '🛒',
    text: `We want to build an online grocery delivery app. Customers should be able to browse products from local stores, add them to cart, schedule a delivery time slot, and pay online. Store owners need a dashboard to manage inventory and see incoming orders. We also want a loyalty program where frequent buyers get discounts. The app should work on both iPhone and Android. We're thinking of launching in 3 cities first, then expanding. Budget is around $150K for the MVP and we want to launch in 4 months.`,
  },
  {
    label: 'SaaS Dashboard',
    icon: '📊',
    text: `I need a B2B analytics dashboard for our sales team. It should pull data from Salesforce, HubSpot, and our internal PostgreSQL database, then show real-time KPIs like MRR, churn rate, pipeline value, and sales velocity. Each team member should only see their own deals but managers see everything. We want automated weekly reports emailed to VPs. Must support SSO via Okta. Need it to handle about 200 concurrent users.`,
  },
  {
    label: 'Healthcare Booking',
    icon: '🏥',
    text: `We're a chain of dental clinics and we need an online booking system. Patients should book appointments based on dentist availability, fill out medical history forms beforehand, get SMS reminders, and be able to reschedule easily. Dentists need a calendar view of their day. The front desk needs an admin panel to manage all bookings across 12 clinic locations. Everything must be HIPAA compliant. We also want a patient portal where they can see their treatment history and invoices.`,
  },
];

export default function StakeholderView() {
  const {
    rawInput,
    setRawInput,
    isProcessing,
    processingStep,
    processInput,
    prdData,
    showSocratic,
    setShowSocratic,
  } = useAppStore();

  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRawInput(text);
    };
    reader.readAsText(file);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: showSocratic && prdData ? '1fr 380px' : '1fr',
        gap: '0',
        height: '100%',
        transition: 'grid-template-columns var(--transition-base)',
      }}
    >
      {/* Main Input Area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '32px',
          overflow: 'auto',
        }}
        className="animate-fade-in"
      >
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h2
            className="heading-section"
            style={{
              fontSize: '1.6rem',
              marginBottom: '8px',
              color: 'var(--text-primary)',
            }}
          >
            Describe Your Project
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Share your idea in plain language — the AI will extract technical requirements,
            identify missing details, and generate engineering-ready specifications.
          </p>
        </div>

        {/* Preset Scenarios */}
        <div style={{ marginBottom: '20px' }}>
          <button
            className="btn-ghost"
            onClick={() => setShowPresets(!showPresets)}
            style={{ marginBottom: '8px' }}
          >
            <Sparkles size={14} />
            Try a sample scenario
            {showPresets ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showPresets && (
            <div
              className="animate-fade-in stagger-children"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '10px',
                marginBottom: '8px',
              }}
            >
              {PRESET_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.label}
                  className="surface-card"
                  onClick={() => {
                    setRawInput(scenario.text);
                    setShowPresets(false);
                  }}
                  style={{
                    padding: '14px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>{scenario.icon}</span>
                  {scenario.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Textarea */}
        <div style={{ position: 'relative', flex: 1, minHeight: '200px' }}>
          <textarea
            className="textarea-base"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder={`Paste or type your project idea here...\n\nExamples:\n• "We want to build a food delivery app where restaurants can list their menus..."\n• "Our company needs an internal tool for tracking employee training compliance..."\n• "I'm building a marketplace for freelance designers to sell templates..."`}
            style={{
              height: '100%',
              minHeight: '280px',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              fontFamily: 'var(--font-body)',
            }}
            disabled={isProcessing}
          />

          {/* Character count */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '16px',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {rawInput.length} chars
          </div>
        </div>

        {/* Action bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '16px',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf,.docx"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button
              className="btn-ghost"
              onClick={() => fileInputRef.current?.click()}
              title="Upload document"
            >
              <Upload size={15} />
              Upload
            </button>
            <button className="btn-ghost" title="Voice input (coming soon)" disabled>
              <Mic size={15} />
              Voice
            </button>
          </div>

          <button
            className="btn-primary"
            onClick={processInput}
            disabled={!rawInput.trim() || isProcessing}
            style={{
              opacity: !rawInput.trim() || isProcessing ? 0.5 : 1,
              cursor: !rawInput.trim() || isProcessing ? 'not-allowed' : 'pointer',
              minWidth: '160px',
              justifyContent: 'center',
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin-slow" />
                Processing...
              </>
            ) : (
              <>
                <Send size={15} />
                Generate Specs
              </>
            )}
          </button>
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div
            className="animate-fade-in"
            style={{
              marginTop: '20px',
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-gold)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
              }}
            >
              <div
                className="animate-pulse-gold"
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--accent-gold)',
                }}
              />
              <span
                style={{
                  color: 'var(--accent-gold)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                AI Pipeline Active
              </span>
            </div>
            <p
              className="mono"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
              }}
            >
              {processingStep}
            </p>
            <div
              style={{
                marginTop: '12px',
                height: '3px',
                borderRadius: '2px',
                background: 'var(--border-subtle)',
                overflow: 'hidden',
              }}
            >
              <div
                className="animate-shimmer"
                style={{
                  height: '100%',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-gold-hover), var(--accent-gold))',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>
          </div>
        )}

        {/* Success state: Sign-off summary */}
        {prdData && !isProcessing && (
          <div
            className="animate-slide-up"
            style={{
              marginTop: '24px',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-elevated)',
              border: '1px solid rgba(52, 211, 153, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px',
              }}
            >
              <CheckCircle2 size={20} color="var(--success)" />
              <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>
                Specification Generated Successfully
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              {[
                { label: 'User Stories', value: prdData.userStories.length, icon: <FileText size={14} /> },
                { label: 'Requirements', value: prdData.functionalRequirements.length, icon: <Info size={14} /> },
                {
                  label: 'Questions',
                  value: prdData.socraticQuestions.filter((q) => !q.answered).length,
                  icon: <MessageCircleQuestion size={14} />,
                },
                { label: 'Out of Scope', value: prdData.outOfScope.length, icon: <AlertTriangle size={14} /> },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      color: 'var(--text-muted)',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '4px',
                    }}
                  >
                    {stat.icon}
                    {stat.label}
                  </div>
                  <div
                    className="gold-gradient heading-display"
                    style={{ fontSize: '1.5rem' }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              {prdData.executiveSummary.substring(0, 200)}...
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={() => useAppStore.getState().setViewMode('engineer')}
              >
                View Full Specification →
              </button>
              {prdData.socraticQuestions.some((q) => !q.answered) && (
                <button
                  className="btn-secondary"
                  onClick={() => setShowSocratic(true)}
                >
                  <MessageCircleQuestion size={15} />
                  Answer Clarifying Questions ({prdData.socraticQuestions.filter((q) => !q.answered).length})
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Socratic Drawer */}
      {showSocratic && prdData && <SocraticDrawer />}
    </div>
  );
}
