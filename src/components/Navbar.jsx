import { useState } from 'react';
import {
  IconGraduationCap,
  IconPlus,
  IconShield,
  IconSun,
  IconMoon,
  IconRefreshCw,
  IconMenu,
  IconX,
  IconInbox,
} from './Icons';

export function Navbar({
  activeView,
  setActiveView,
  pendingCount,
  theme,
  toggleTheme,
  onResetData,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand */}
        <button
          type="button"
          className="navbar-brand"
          onClick={() => handleNavClick('submit')}
          aria-label="CampusDesk Home - Submit Issue"
        >
          <div className="brand-logo-icon">
            <IconGraduationCap size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">CampusDesk</span>
            <span className="brand-subtitle">Student & Staff Helpdesk</span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <button
            type="button"
            className={`nav-btn ${activeView === 'submit' ? 'active' : ''}`}
            onClick={() => handleNavClick('submit')}
          >
            <IconPlus size={16} />
            <span>Submit Issue</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activeView === 'tickets' ? 'active' : ''}`}
            onClick={() => handleNavClick('tickets')}
          >
            <IconInbox size={16} />
            <span>Track & Browse</span>
          </button>

          <button
            type="button"
            className={`nav-btn admin-btn ${activeView === 'admin' ? 'active' : ''}`}
            onClick={() => handleNavClick('admin')}
          >
            <IconShield size={16} />
            <span>Admin Dashboard</span>
            {pendingCount > 0 && (
              <span className="nav-pending-badge" title={`${pendingCount} pending issues`}>
                {pendingCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right utility controls */}
        <div className="nav-actions">
          <button
            type="button"
            className="action-icon-btn"
            onClick={onResetData}
            title="Reset to default sample data"
          >
            <IconRefreshCw size={17} />
            <span className="action-btn-text">Reset Demo</span>
          </button>

          <button
            type="button"
            className="action-icon-btn theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <IconX size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <button
            type="button"
            className={`mobile-nav-link ${activeView === 'submit' ? 'active' : ''}`}
            onClick={() => handleNavClick('submit')}
          >
            <IconPlus size={18} />
            <span>Submit Issue</span>
          </button>
          <button
            type="button"
            className={`mobile-nav-link ${activeView === 'tickets' ? 'active' : ''}`}
            onClick={() => handleNavClick('tickets')}
          >
            <IconInbox size={18} />
            <span>Track & Browse</span>
          </button>
          <button
            type="button"
            className={`mobile-nav-link ${activeView === 'admin' ? 'active' : ''}`}
            onClick={() => handleNavClick('admin')}
          >
            <IconShield size={18} />
            <span>Admin Dashboard ({pendingCount} Pending)</span>
          </button>
          <button
            type="button"
            className="mobile-nav-link reset-link"
            onClick={() => {
              onResetData();
              setMobileMenuOpen(false);
            }}
          >
            <IconRefreshCw size={18} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      )}
    </header>
  );
}

