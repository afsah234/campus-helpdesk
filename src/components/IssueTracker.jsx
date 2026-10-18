import { useState } from 'react';
import { StatusBadge, PriorityBadge } from './Badges';
import {
  IconSearch,
  IconFilter,
  IconPlus,
  IconEye,
  IconClock,
  IconBuilding,
  IconInbox,
  IconX,
} from './Icons';
import { CATEGORIES, STATUS_LIST } from '../constants/issueData';

export function IssueTracker({
  tickets = [],
  onSelectTicket,
  onNavigateToSubmit,
  initialSearch = '',
}) {
  const [prevInitialSearch, setPrevInitialSearch] = useState(initialSearch);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Adjust state while rendering when prop changes (React recommended pattern)
  if (initialSearch !== prevInitialSearch) {
    setPrevInitialSearch(initialSearch);
    setSearchTerm(initialSearch);
  }

  const filteredTickets = tickets.filter((t) => {
    // Search match
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      t.id.toLowerCase().includes(term) ||
      t.title.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term) ||
      t.studentName.toLowerCase().includes(term) ||
      t.studentId.toLowerCase().includes(term) ||
      t.location.toLowerCase().includes(term);

    // Status match
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    // Category match
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="tracker-container">
      {/* Search & Filter Header */}
      <div className="tracker-controls-card">
        <div className="tracker-header-row">
          <div>
            <h2>Track & Browse Helpdesk Tickets</h2>
            <p className="card-subtitle">
              Check the live status of your reported campus issues or look up a specific Ticket ID.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNavigateToSubmit}
          >
            <IconPlus size={16} /> Submit New Issue
          </button>
        </div>

        <div className="tracker-filter-bar">
          {/* Search Input */}
          <div className="search-input-box">
            <IconSearch size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Ticket ID (e.g., TKT-2026-1049), keyword, or student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
              >
                <IconX size={15} />
              </button>
            )}
          </div>

          <div className="filter-dropdowns-row">
            {/* Status Tabs */}
            <div className="status-pill-tabs">
              <button
                type="button"
                className={`pill-tab ${statusFilter === 'All' ? 'active' : ''}`}
                onClick={() => setStatusFilter('All')}
              >
                All ({tickets.length})
              </button>
              {STATUS_LIST.map((st) => {
                const count = tickets.filter((t) => t.status === st).length;
                return (
                  <button
                    key={st}
                    type="button"
                    className={`pill-tab ${statusFilter === st ? 'active' : ''}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st} ({count})
                  </button>
                );
              })}
            </div>

            {/* Category Dropdown */}
            <div className="category-select-wrapper">
              <IconFilter size={15} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Cards Grid */}
      {filteredTickets.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon-circle">
            <IconInbox size={40} />
          </div>
          <h3>No tickets match your search</h3>
          <p>
            We couldn't find any issues matching your active query and filters. Try adjusting your
            search keywords or reset filters.
          </p>
          <div className="empty-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setCategoryFilter('All');
              }}
            >
              Clear All Filters
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onNavigateToSubmit}
            >
              <IconPlus size={16} /> Submit an Issue
            </button>
          </div>
        </div>
      ) : (
        <div className="tickets-grid">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="ticket-card"
              onClick={() => onSelectTicket(ticket)}
            >
              <div className="ticket-card-header">
                <span className="ticket-id-tag">{ticket.id}</span>
                <div className="ticket-card-badges">
                  <PriorityBadge priority={ticket.priority} size="sm" />
                  <StatusBadge status={ticket.status} size="sm" />
                </div>
              </div>

              <h4 className="ticket-title">{ticket.title}</h4>
              <p className="ticket-snippet">{ticket.description}</p>

              <div className="ticket-card-meta">
                <div className="meta-item">
                  <IconBuilding size={14} />
                  <span>{ticket.location}</span>
                </div>
                <div className="meta-item">
                  <IconClock size={14} />
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
              </div>

              <div className="ticket-card-footer">
                <span className="category-pill">{ticket.category}</span>
                <button
                  type="button"
                  className="btn-view-ticket"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTicket(ticket);
                  }}
                >
                  <IconEye size={15} />
                  <span>Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

