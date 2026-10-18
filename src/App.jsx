import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { IssueForm } from './components/IssueForm';
import { IssueTracker } from './components/IssueTracker';
import { AdminDashboard } from './components/AdminDashboard';
import { IssueDetailModal } from './components/IssueDetailModal';
import { Toast } from './components/Toast';
import {
  getStoredTickets,
  saveTicketsToStorage,
  resetTicketsStorage,
  getSavedTheme,
  saveSavedTheme,
} from './utils/storage';
import { STATUSES } from './constants/issueData';
import './App.css';

function App() {
  const [tickets, setTickets] = useState(() => getStoredTickets());
  const [activeView, setActiveView] = useState('submit'); // 'submit' | 'tickets' | 'admin'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQueryForTracker, setSearchQueryForTracker] = useState('');
  const [theme, setTheme] = useState(() => getSavedTheme());
  const [toasts, setToasts] = useState([]);

  // Sync tickets with localStorage
  useEffect(() => {
    saveTicketsToStorage(tickets);
  }, [tickets]);

  // Apply theme to HTML root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveSavedTheme(theme);
  }, [theme]);

  // Add Toast helper
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle dark/light theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Ticket creation handler
  const handleCreateTicket = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    addToast(`Ticket #${newTicket.id} submitted successfully! Status: Pending.`);
  };

  // Status update handler
  const handleUpdateStatus = (ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    // Keep selectedTicket in sync if open
    setSelectedTicket((prev) =>
      prev && prev.id === ticketId
        ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() }
        : prev
    );

    addToast(`Ticket #${ticketId} status changed to ${newStatus}.`);
  };

  // Admin notes update handler
  const handleUpdateNotes = (ticketId, notes) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            adminNotes: notes,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    setSelectedTicket((prev) =>
      prev && prev.id === ticketId
        ? { ...prev, adminNotes: notes, updatedAt: new Date().toISOString() }
        : prev
    );

    addToast(`Administrative notes updated for #${ticketId}.`);
  };

  // Department assignment handler
  const handleUpdateDepartment = (ticketId, department) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            assignedTo: department,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    setSelectedTicket((prev) =>
      prev && prev.id === ticketId
        ? { ...prev, assignedTo: department, updatedAt: new Date().toISOString() }
        : prev
    );

    addToast(`Ticket #${ticketId} assigned to ${department}.`);
  };

  // Delete ticket handler
  const handleDeleteTicket = (ticketId) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(null);
    }
    addToast(`Ticket #${ticketId} deleted.`, 'error');
  };

  // Bulk status update
  const handleBulkUpdateStatus = (ticketIds, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (ticketIds.includes(t.id)) {
          return {
            ...t,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
    addToast(`${ticketIds.length} ticket(s) updated to ${newStatus}.`);
  };

  // Bulk delete
  const handleBulkDelete = (ticketIds) => {
    setTickets((prev) => prev.filter((t) => !ticketIds.includes(t.id)));
    if (selectedTicket && ticketIds.includes(selectedTicket.id)) {
      setSelectedTicket(null);
    }
    addToast(`${ticketIds.length} ticket(s) deleted.`, 'error');
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('Reset all ticket records back to default sample campus tickets?')) {
      const reset = resetTicketsStorage();
      setTickets(reset);
      setSelectedTicket(null);
      addToast('Campus helpdesk demo data successfully restored.');
    }
  };

  // Navigation from submit success to tracking
  const handleNavigateToTrack = (ticketId) => {
    setSearchQueryForTracker(ticketId);
    setActiveView('tickets');
    const matched = tickets.find((t) => t.id === ticketId);
    if (matched) {
      setSelectedTicket(matched);
    }
  };

  const pendingCount = tickets.filter((t) => t.status === STATUSES.PENDING).length;

  return (
    <div className="campus-app">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        pendingCount={pendingCount}
        theme={theme}
        toggleTheme={toggleTheme}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeView === 'submit' && (
          <IssueForm
            onSubmitSuccess={handleCreateTicket}
            onNavigateToTrack={handleNavigateToTrack}
          />
        )}

        {activeView === 'tickets' && (
          <IssueTracker
            tickets={tickets}
            onSelectTicket={(ticket) => setSelectedTicket(ticket)}
            onNavigateToSubmit={() => setActiveView('submit')}
            initialSearch={searchQueryForTracker}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            tickets={tickets}
            onUpdateStatus={handleUpdateStatus}
            onUpdateDepartment={handleUpdateDepartment}
            onDeleteTicket={handleDeleteTicket}
            onBulkUpdateStatus={handleBulkUpdateStatus}
            onBulkDelete={handleBulkDelete}
            onSelectTicket={(ticket) => setSelectedTicket(ticket)}
          />
        )}
      </main>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <IssueDetailModal
          key={selectedTicket.id}
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdateStatus={handleUpdateStatus}
          onUpdateNotes={handleUpdateNotes}
          onUpdateDepartment={handleUpdateDepartment}
        />
      )}

      {/* Floating Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Campus Footer */}
      <footer className="campus-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <span className="footer-logo">CampusDesk Help & Services</span>
            <p>
              Dedicated campus assistance platform for students, faculty, and resident scholars.
              Operating 24/7 across all residential halls and academic complexes.
            </p>
          </div>
          <div className="footer-col">
            <span className="footer-heading">Emergency Hotlines</span>
            <ul className="footer-links">
              <li>IT Tech Operations: ext. 4357 (HELP)</li>
              <li>Facilities & Maintenance: ext. 2200</li>
              <li>Campus Safety & Security: ext. 9111</li>
            </ul>
          </div>
          <div className="footer-col">
            <span className="footer-heading">Operational Hours</span>
            <ul className="footer-links">
              <li>Digital Support: 24/7 Portal System</li>
              <li>Helpdesk Desk Walk-in: Mon - Sat, 8:00 AM - 8:00 PM</li>
              <li>Central Library Ground Floor, Room 102</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} University Campus Helpdesk. Local storage data persistent.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
