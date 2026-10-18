import { useState } from 'react';
import { StatsCards } from './StatsCards';
import { AnalyticsCharts } from './AnalyticsCharts';
import { PriorityBadge } from './Badges';
import {
  IconSearch,
  IconDownload,
  IconTrash,
  IconEye,
  IconRefreshCw,
  IconCheckCircle,
  IconClock,
  IconX,
  IconBarChart,
} from './Icons';
import {
  CATEGORIES,
  STATUSES,
  STATUS_LIST,
  PRIORITY_LIST,
  DEPARTMENTS,
} from '../constants/issueData';

export function AdminDashboard({
  tickets = [],
  onUpdateStatus,
  onUpdateDepartment,
  onDeleteTicket,
  onBulkUpdateStatus,
  onBulkDelete,
  onSelectTicket,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showAnalytics, setShowAnalytics] = useState(true);

  // Filter tickets
  const filtered = tickets.filter((t) => {
    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      !term ||
      t.id.toLowerCase().includes(term) ||
      t.title.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term) ||
      t.studentName.toLowerCase().includes(term) ||
      t.studentId.toLowerCase().includes(term) ||
      t.location.toLowerCase().includes(term);

    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;

    return matchSearch && matchStatus && matchCategory && matchPriority;
  });

  // Sort tickets
  const sortedTickets = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === 'priority') {
      const order = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      return (order[b.priority] || 0) - (order[a.priority] || 0);
    }
    if (sortBy === 'status') {
      const order = { Pending: 3, 'In Progress': 2, Resolved: 1 };
      return (order[b.status] || 0) - (order[a.status] || 0);
    }
    return 0;
  });

  // Selection helpers
  const allFilteredSelected =
    sortedTickets.length > 0 &&
    sortedTickets.every((t) => selectedIds.has(t.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(new Set());
    } else {
      const next = new Set(selectedIds);
      sortedTickets.forEach((t) => next.add(t.id));
      setSelectedIds(next);
    }
  };

  const toggleSelectOne = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Bulk actions
  const handleBulkStatus = (newStatus) => {
    if (selectedIds.size === 0) return;
    onBulkUpdateStatus(Array.from(selectedIds), newStatus);
    setSelectedIds(new Set());
  };

  const handleBulkDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to permanently delete ${selectedIds.size} selected ticket(s)?`)) {
      onBulkDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Ticket ID',
      'Status',
      'Priority',
      'Category',
      'Subject',
      'Student Name',
      'Student ID',
      'Email',
      'Building / Location',
      'Room',
      'Assigned Department',
      'Created Date',
    ];

    const rows = sortedTickets.map((t) => [
      `"${t.id}"`,
      `"${t.status}"`,
      `"${t.priority}"`,
      `"${t.category}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.studentName.replace(/"/g, '""')}"`,
      `"${t.studentId}"`,
      `"${t.email}"`,
      `"${t.location.replace(/"/g, '""')}"`,
      `"${(t.room || '').replace(/"/g, '""')}"`,
      `"${t.assignedTo || ''}"`,
      `"${new Date(t.createdAt).toLocaleString()}"`,
    ]);

    const csvString = [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `campus_helpdesk_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Top Banner */}
      <div className="admin-header-row">
        <div>
          <h2>Helpdesk Administrative Control Center</h2>
          <p className="card-subtitle">
            Manage student reports, dispatch departments, triage urgent tickets, and monitor status pipelines.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            <IconBarChart size={16} />
            <span>{showAnalytics ? 'Hide Analytics' : 'Show Analytics'}</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExportCSV}
            title="Export filtered records to CSV"
          >
            <IconDownload size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatsCards
        tickets={tickets}
        activeStatusFilter={statusFilter}
        onFilterByStatus={(status) => {
          setStatusFilter(status);
          if (status !== 'All') setPriorityFilter('All');
        }}
        activePriorityFilter={priorityFilter}
        onFilterByPriority={(pri) => {
          setPriorityFilter(pri);
          setStatusFilter('All');
        }}
      />

      {/* Visual Analytics */}
      {showAnalytics && <AnalyticsCharts tickets={tickets} />}

      {/* Filters and Search Bar */}
      <div className="admin-controls-card">
        <div className="admin-filters-grid">
          {/* Search box */}
          <div className="search-input-box admin-search">
            <IconSearch size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, keyword, student, room..."
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

          {/* Status Filter */}
          <div className="filter-select-group">
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-select-group">
            <label>Category:</label>
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

          {/* Priority Filter */}
          <div className="filter-select-group">
            <label>Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              {PRIORITY_LIST.map((pri) => (
                <option key={pri} value={pri}>
                  {pri}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="filter-select-group">
            <label>Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority (High to Low)</option>
              <option value="status">Status (Pending First)</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar (appears when items are selected) */}
        {selectedIds.size > 0 && (
          <div className="bulk-actions-bar">
            <span className="bulk-count">
              <strong>{selectedIds.size}</strong> ticket(s) selected
            </span>
            <div className="bulk-btn-group">
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => handleBulkStatus(STATUSES.PENDING)}
              >
                <IconClock size={14} /> Mark Pending
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => handleBulkStatus(STATUSES.IN_PROGRESS)}
              >
                <IconRefreshCw size={14} /> Mark In Progress
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => handleBulkStatus(STATUSES.RESOLVED)}
              >
                <IconCheckCircle size={14} /> Mark Resolved
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={handleBulkDeleteSelected}
              >
                <IconTrash size={14} /> Delete Selected
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => setSelectedIds(new Set())}
              >
                Deselect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table & Cards Container */}
      <div className="card admin-table-card">
        <div className="table-header-info">
          <span>Showing <strong>{sortedTickets.length}</strong> of {tickets.length} total tickets</span>
          {(searchTerm || statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All') && (
            <button
              type="button"
              className="btn-link"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setCategoryFilter('All');
                setPriorityFilter('All');
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {sortedTickets.length === 0 ? (
          <div className="empty-table-view">
            <p>No tickets match the selected filters.</p>
          </div>
        ) : (
          <div className="responsive-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="th-checkbox">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAll}
                      aria-label="Select all tickets"
                    />
                  </th>
                  <th>Ticket</th>
                  <th>Reporter</th>
                  <th>Category & Location</th>
                  <th>Priority</th>
                  <th>Status Workflow</th>
                  <th>Assigned Team</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTickets.map((ticket) => {
                  const isChecked = selectedIds.has(ticket.id);
                  return (
                    <tr
                      key={ticket.id}
                      className={isChecked ? 'row-selected' : ''}
                    >
                      <td className="td-checkbox">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(ticket.id)}
                          aria-label={`Select ticket ${ticket.id}`}
                        />
                      </td>

                      {/* Ticket Summary */}
                      <td className="td-ticket">
                        <div className="ticket-id-row">
                          <span className="table-ticket-id">{ticket.id}</span>
                          <span className="table-date">{formatDate(ticket.createdAt)}</span>
                        </div>
                        <div
                          className="table-ticket-title"
                          onClick={() => onSelectTicket(ticket)}
                          title="Click to view details"
                        >
                          {ticket.title}
                        </div>
                      </td>

                      {/* Reporter */}
                      <td className="td-reporter">
                        <div className="reporter-name">{ticket.studentName}</div>
                        <div className="reporter-sub">{ticket.studentId}</div>
                        <div className="reporter-email">{ticket.email}</div>
                      </td>

                      {/* Category & Location */}
                      <td className="td-cat-loc">
                        <div className="table-category">{ticket.category}</div>
                        <div className="table-loc">{ticket.location}</div>
                        {ticket.room && <div className="table-room">({ticket.room})</div>}
                      </td>

                      {/* Priority */}
                      <td className="td-priority">
                        <PriorityBadge priority={ticket.priority} size="sm" />
                      </td>

                      {/* Status with Quick Transition Dropdown */}
                      <td className="td-status">
                        <div className="status-dropdown-wrapper">
                          <select
                            className={`status-select status-color-${ticket.status
                              .toLowerCase()
                              .replace(' ', '-')}`}
                            value={ticket.status}
                            onChange={(e) => onUpdateStatus(ticket.id, e.target.value)}
                          >
                            <option value={STATUSES.PENDING}>Pending</option>
                            <option value={STATUSES.IN_PROGRESS}>In Progress</option>
                            <option value={STATUSES.RESOLVED}>Resolved</option>
                          </select>
                        </div>
                      </td>

                      {/* Assigned Department */}
                      <td className="td-assigned">
                        <select
                          className="assigned-dept-select"
                          value={ticket.assignedTo || DEPARTMENTS[0]}
                          onChange={(e) => onUpdateDepartment(ticket.id, e.target.value)}
                        >
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="td-actions">
                        <div className="action-buttons-cell">
                          <button
                            type="button"
                            className="btn-action-icon"
                            title="View / Edit Ticket Details"
                            onClick={() => onSelectTicket(ticket)}
                          >
                            <IconEye size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-action-icon btn-delete-icon"
                            title="Delete Ticket"
                            onClick={() => {
                              if (window.confirm(`Delete ticket ${ticket.id}?`)) {
                                onDeleteTicket(ticket.id);
                              }
                            }}
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
