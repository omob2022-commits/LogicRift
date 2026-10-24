'use client';

import { useAppStore } from '@/store/useAppStore';
import {
  Sun,
  Moon,
  RotateCcw,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { theme, toggleTheme, viewMode, setViewMode, prdData, resetProject } =
    useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <header
      className="glass"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderRadius: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-hover))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Zap size={20} color="#09120E" strokeWidth={2.5} />
        </div>
        <div>
          <h1
            className="heading-display gold-gradient"
            style={{ fontSize: '1.25rem', lineHeight: 1 }}
          >
            LogicRift
          </h1>
          <p
            style={{
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            Requirements Engine
          </p>
        </div>
      </div>

      {/* Center: Role Toggle (Desktop) */}
      <div
        className="role-toggle-desktop"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="tab-group"
          style={{ background: 'var(--bg)', padding: '3px' }}
        >
          <button
            className={`tab-item ${viewMode === 'stakeholder' ? 'active' : ''}`}
            onClick={() => setViewMode('stakeholder')}
          >
            👤 Stakeholder View
          </button>
          <button
            className={`tab-item ${viewMode === 'engineer' ? 'active' : ''}`}
            onClick={() => setViewMode('engineer')}
            disabled={!prdData}
            style={{
              opacity: prdData ? 1 : 0.4,
              cursor: prdData ? 'pointer' : 'not-allowed',
            }}
          >
            ⚙️ Engineer View
          </button>
        </div>
      </div>

      {/* Right actions (Desktop) */}
      <div
        className="actions-desktop"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        {prdData && (
          <button
            className="btn-ghost"
            onClick={resetProject}
            title="Start new project"
          >
            <RotateCcw size={15} />
            New
          </button>
        )}
        <button className="btn-icon" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        className="btn-icon mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{ display: 'none' }}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'var(--bg)',
            borderBottom: '1px solid var(--border-subtle)',
            zIndex: 99,
          }}
          className="animate-fade-in"
        >
          <div className="tab-group" style={{ width: '100%' }}>
            <button
              className={`tab-item ${viewMode === 'stakeholder' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('stakeholder');
                setMobileMenuOpen(false);
              }}
              style={{ flex: 1 }}
            >
              👤 Stakeholder
            </button>
            <button
              className={`tab-item ${viewMode === 'engineer' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('engineer');
                setMobileMenuOpen(false);
              }}
              disabled={!prdData}
              style={{
                flex: 1,
                opacity: prdData ? 1 : 0.4,
                cursor: prdData ? 'pointer' : 'not-allowed',
              }}
            >
              ⚙️ Engineer
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {prdData && (
              <button className="btn-ghost" onClick={resetProject} style={{ flex: 1 }}>
                <RotateCcw size={15} /> New Project
              </button>
            )}
            <button className="btn-icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .role-toggle-desktop {
            display: none !important;
          }
          .actions-desktop {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
