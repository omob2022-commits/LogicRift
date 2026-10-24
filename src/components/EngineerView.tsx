'use client';

import { useAppStore } from '@/store/useAppStore';
import {
  Target,
  BookOpen,
  GitBranch,
  Cpu,
  Download,
  FileJson,
  FileText,
  ClipboardList,
  ArrowLeftRight,
} from 'lucide-react';
import ScopeTab from './tabs/ScopeTab';
import StoriesTab from './tabs/StoriesTab';
import DiagramsTab from './tabs/DiagramsTab';
import TechStackTab from './tabs/TechStackTab';
import ReverseTranslator from './ReverseTranslator';
import { useState } from 'react';

const TABS = [
  { key: 'scope' as const, label: 'Scope & Requirements', icon: <Target size={14} /> },
  { key: 'stories' as const, label: 'User Stories', icon: <BookOpen size={14} /> },
  { key: 'diagrams' as const, label: 'System Diagrams', icon: <GitBranch size={14} /> },
  { key: 'techstack' as const, label: 'Tech Stack', icon: <Cpu size={14} /> },
];

export default function EngineerView() {
  const { activeTab, setActiveTab, prdData } = useAppStore();
  const [showReverseTranslator, setShowReverseTranslator] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  if (!prdData) return null;

  const handleExportMarkdown = () => {
    const md = generateMarkdown(prdData);
    downloadFile(md, `${prdData.projectTitle.replace(/\s+/g, '_')}_PRD.md`, 'text/markdown');
    setExportMenuOpen(false);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(prdData, null, 2);
    downloadFile(json, `${prdData.projectTitle.replace(/\s+/g, '_')}_PRD.json`, 'application/json');
    setExportMenuOpen(false);
  };

  const handleCopyJIRA = () => {
    const jira = generateJIRAPayload(prdData);
    navigator.clipboard.writeText(jira);
    setExportMenuOpen(false);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: showReverseTranslator ? '1fr 420px' : '1fr',
        height: '100%',
        transition: 'grid-template-columns var(--transition-base)',
      }}
    >
      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
        className="animate-fade-in"
      >
        {/* Header bar */}
        <div
          style={{
            padding: '16px 28px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Tabs */}
          <div className="tab-group">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className={`btn-ghost ${showReverseTranslator ? 'active' : ''}`}
              onClick={() => setShowReverseTranslator(!showReverseTranslator)}
              style={{
                background: showReverseTranslator ? 'var(--accent-gold-dim)' : 'transparent',
                color: showReverseTranslator ? 'var(--accent-gold)' : 'var(--text-secondary)',
                borderColor: showReverseTranslator ? 'var(--border-gold)' : 'transparent',
              }}
            >
              <ArrowLeftRight size={14} />
              Translate
            </button>

            {/* Export dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn-primary"
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                style={{ fontSize: '0.8rem', padding: '8px 14px' }}
              >
                <Download size={14} />
                Export
              </button>
              {exportMenuOpen && (
                <div
                  className="animate-fade-in glass"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    width: '220px',
                    borderRadius: 'var(--radius-md)',
                    padding: '6px',
                    zIndex: 50,
                  }}
                >
                  <button
                    onClick={handleExportMarkdown}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.background = 'var(--border-subtle)')
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.background = 'transparent')
                    }
                  >
                    <FileText size={15} color="var(--accent-gold)" />
                    Download Markdown
                  </button>
                  <button
                    onClick={handleExportJSON}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.background = 'var(--border-subtle)')
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.background = 'transparent')
                    }
                  >
                    <FileJson size={15} color="var(--accent-gold)" />
                    Export Raw JSON
                  </button>
                  <button
                    onClick={handleCopyJIRA}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.background = 'var(--border-subtle)')
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.background = 'transparent')
                    }
                  >
                    <ClipboardList size={15} color="var(--accent-gold)" />
                    Copy JIRA Payload
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '28px' }}>
          {activeTab === 'scope' && <ScopeTab />}
          {activeTab === 'stories' && <StoriesTab />}
          {activeTab === 'diagrams' && <DiagramsTab />}
          {activeTab === 'techstack' && <TechStackTab />}
        </div>
      </div>

      {/* Reverse Translator Drawer */}
      {showReverseTranslator && <ReverseTranslator />}
    </div>
  );
}

/* ─── HELPERS ─── */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function generateMarkdown(prd: NonNullable<ReturnType<typeof useAppStore.getState>['prdData']>) {
  let md = `# ${prd.projectTitle}\n\n`;
  md += `## Executive Summary\n\n${prd.executiveSummary}\n\n`;
  md += `---\n\n## User Stories\n\n`;
  prd.userStories.forEach((s) => {
    md += `### ${s.id}: As a ${s.asA}\n`;
    md += `**I want to** ${s.iWantTo}\n`;
    md += `**So that** ${s.soThat}\n\n`;
    md += `**Acceptance Criteria:**\n`;
    s.acceptanceCriteria.forEach((c) => (md += `- ${c}\n`));
    md += '\n';
  });
  md += `---\n\n## Functional Requirements\n\n`;
  prd.functionalRequirements.forEach((r) => (md += `- ${r}\n`));
  md += `\n---\n\n## Non-Functional Requirements\n\n`;
  md += `### Performance\n${prd.nonFunctionalRequirements.performance}\n\n`;
  md += `### Security\n${prd.nonFunctionalRequirements.security}\n\n`;
  md += `### Scalability\n${prd.nonFunctionalRequirements.scalability}\n\n`;
  md += `---\n\n## Out of Scope\n\n`;
  prd.outOfScope.forEach((o) => (md += `- ${o}\n`));
  md += `\n---\n\n## Tech Stack Recommendations\n\n`;
  prd.techStackRecommendations.forEach((t) => (md += `- ${t}\n`));
  md += `\n---\n\n## System Diagram\n\n\`\`\`mermaid\n${prd.mermaidDiagram}\n\`\`\`\n`;
  return md;
}

function generateJIRAPayload(prd: NonNullable<ReturnType<typeof useAppStore.getState>['prdData']>) {
  const tickets = prd.userStories.map((s) => ({
    summary: `[${s.id}] As a ${s.asA}, I want to ${s.iWantTo}`,
    description: `**Business Value:** ${s.soThat}\n\n**Acceptance Criteria:**\n${s.acceptanceCriteria.map((c) => `* ${c}`).join('\n')}`,
    type: 'Story',
    labels: ['logicrift-generated', 'mvp'],
  }));
  return JSON.stringify(tickets, null, 2);
}
