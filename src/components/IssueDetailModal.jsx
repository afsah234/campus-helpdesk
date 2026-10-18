import { useState, useEffect } from 'react';
import { StatusBadge, PriorityBadge } from './Badges';
import {
  IconX,
  IconClock,
  IconCheckCircle,
  IconRefreshCw,
  IconUser,
  IconBuilding,
  IconPaperclip,
  IconEdit,
} from './Icons';
import { STATUSES, DEPARTMENTS } from '../constants/issueData';

export function IssueDetailModal({
  ticket,
  onClose,
  onUpdateStatus,
  onUpdateNotes,
  onUpdateDepartment,
}) {
  const [prevTicketId, setPrevTicketId] = useState(ticket ? ticket.id : null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [noteDraft, setNoteDraft] = useState(ticket ? ticket.adminNotes || '' : '');
  const [selectedDept, setSelectedDept] = useState(ticket ? ticket.assignedTo || DEPARTMENTS[0] : DEPARTMENTS[0]);

  // Adjust state while rendering if ticket prop changes (React recommended pattern)
  if (ticket && ticket.id !== prevTicketId) {
    setPrevTicketId(ticket.id);
    setNoteDraft(ticket.adminNotes || '');
    setSelectedDept(ticket.assignedTo || DEPARTMENTS[0]);
    setIsEditingNotes(false);
  }

  // Accessibility: Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!ticket) return null;

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoString;
    }
  };

  const handleSaveNotes = () => {
    if (onUpdateNotes) {
      onUpdateNotes(ticket.id, noteDraft);
    }
    setIsEditingNotes(false);
  };

  const handleDeptChange = (e) => {
    const val = e.target.value;
    setSelectedDept(val);
    if (onUpdateDepartment) {
      onUpdateDepartment(ticket.id, val);
    }
  };

  // Determine active step in stepper
  const currentStep =
    ticket.status === STATUSES.PENDING
      ? 1
      : ticket.status === STATUSES.IN_PROGRESS
      ? 2
      : 3;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-ticket-id">{ticket.id}</span>
            <div className="modal-badges">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Status Stepper */}
        <div className="status-stepper-box">
          <div className="status-stepper">
            <div className={`step-item ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
              <div className="step-circle">
                <IconClock size={14} />
              </div>
              <span className="step-text">1. Pending</span>
            </div>
            <div className={`step-connector ${currentStep >= 2 ? 'completed' : ''}`} />

            <div className={`step-item ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}>
              <div className="step-circle">
                <IconRefreshCw size={14} />
              </div>
              <span className="step-text">2. In Progress</span>
            </div>
            <div className={`step-connector ${currentStep >= 3 ? 'completed' : ''}`} />

            <div className={`step-item ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'active' : ''}`}>
              <div className="step-circle">
                <IconCheckCircle size={14} />
              </div>
              <span className="step-text">3. Resolved</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Issue Subject */}
          <div className="detail-section">
            <h3 className="detail-subject">{ticket.title}</h3>
            <p className="detail-description">{ticket.description}</p>
            {ticket.attachmentName && (
              <div className="detail-attachment">
                <IconPaperclip size={15} />
                <span>Attachment: <strong>{ticket.attachmentName}</strong></span>
              </div>
            )}
          </div>

          <div className="detail-grid-2">
            {/* Reporter Info */}
            <div className="detail-card">
              <div className="detail-card-title">
                <IconUser size={16} />
                <h4>Reporter Information</h4>
              </div>
              <div className="detail-meta-list">
                <div className="meta-row">
                  <span className="meta-key">Name:</span>
                  <span className="meta-val">{ticket.studentName}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">ID:</span>
                  <span className="meta-val font-mono">{ticket.studentId}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Email:</span>
                  <span className="meta-val">{ticket.email}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Phone:</span>
                  <span className="meta-val">{ticket.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Location & Department */}
            <div className="detail-card">
              <div className="detail-card-title">
                <IconBuilding size={16} />
                <h4>Location & Assignment</h4>
              </div>
              <div className="detail-meta-list">
                <div className="meta-row">
                  <span className="meta-key">Category:</span>
                  <span className="meta-val font-bold">{ticket.category}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Building:</span>
                  <span className="meta-val">{ticket.location}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Room / Spot:</span>
                  <span className="meta-val">{ticket.room || 'General Area'}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Assigned To:</span>
                  <span className="meta-val">
                    <select
                      className="dept-select-inline"
                      value={selectedDept}
                      onChange={handleDeptChange}
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="detail-timestamps">
            <span><strong>Submitted:</strong> {formatDate(ticket.createdAt)}</span>
            <span><strong>Last Updated:</strong> {formatDate(ticket.updatedAt)}</span>
          </div>

          {/* Admin / Resolution Notes */}
          <div className="admin-notes-card">
            <div className="notes-header">
              <h4>Administrative & Resolution Notes</h4>
              {!isEditingNotes && (
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setIsEditingNotes(true)}
                >
                  <IconEdit size={14} /> Edit Notes
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="notes-edit-box">
                <textarea
                  rows={3}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add resolution notes, technician comments, or next steps..."
                />
                <div className="notes-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setNoteDraft(ticket.adminNotes || '');
                      setIsEditingNotes(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveNotes}
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <p className="notes-content">
                {ticket.adminNotes || 'No notes added yet. Use "Edit Notes" to update comments.'}
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer: Quick Status Switcher */}
        <div className="modal-footer">
          <div className="status-quick-switch">
            <span className="switch-label">Update Status:</span>
            <div className="status-buttons-row">
              <button
                type="button"
                className={`btn btn-sm ${
                  ticket.status === STATUSES.PENDING ? 'btn-active-pending' : 'btn-outline'
                }`}
                onClick={() => onUpdateStatus(ticket.id, STATUSES.PENDING)}
              >
                <IconClock size={14} /> Pending
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  ticket.status === STATUSES.IN_PROGRESS ? 'btn-active-progress' : 'btn-outline'
                }`}
                onClick={() => onUpdateStatus(ticket.id, STATUSES.IN_PROGRESS)}
              >
                <IconRefreshCw size={14} /> In Progress
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  ticket.status === STATUSES.RESOLVED ? 'btn-active-resolved' : 'btn-outline'
                }`}
                onClick={() => onUpdateStatus(ticket.id, STATUSES.RESOLVED)}
              >
                <IconCheckCircle size={14} /> Resolved
              </button>
            </div>
          </div>

          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

