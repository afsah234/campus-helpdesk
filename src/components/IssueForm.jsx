import { useState } from 'react';
import {
  CATEGORIES,
  PRIORITIES,
  PRIORITY_LIST,
  LOCATIONS,
  DEPARTMENTS,
} from '../constants/issueData';
import { generateTicketId } from '../utils/storage';
import {
  IconPlus,
  IconCheckCircle,
  IconAlertCircle,
  IconPaperclip,
  IconBuilding,
  IconUser,
  IconTag,
  IconX,
} from './Icons';

export function IssueForm({ onSubmitSuccess, onNavigateToTrack }) {
  const initialFormState = {
    studentName: '',
    studentId: '',
    email: '',
    phone: '',
    category: CATEGORIES[0],
    priority: PRIORITIES.MEDIUM,
    location: LOCATIONS[0],
    room: '',
    title: '',
    description: '',
    attachmentName: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const validate = () => {
    const errs = {};
    const trimmedName = formData.studentName.trim();
    if (!trimmedName) {
      errs.studentName = 'Full Name is required.';
    } else if (trimmedName.length < 2) {
      errs.studentName = 'Full Name must be at least 2 characters.';
    }

    const trimmedId = formData.studentId.trim();
    if (!trimmedId) {
      errs.studentId = 'Student / Staff ID is required (e.g., STU-2026-1234).';
    } else if (trimmedId.length < 3) {
      errs.studentId = 'Student / Staff ID must be at least 3 characters.';
    }

    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      errs.email = 'University Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = 'Please provide a valid email address (e.g., name@campus.edu).';
    }

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      errs.title = 'Issue Subject / Title is required.';
    } else if (trimmedTitle.length < 5) {
      errs.title = 'Subject must be at least 5 characters.';
    }

    const trimmedDesc = formData.description.trim();
    if (!trimmedDesc) {
      errs.description = 'Please provide a detailed description of the issue.';
    } else if (trimmedDesc.length < 15) {
      errs.description = 'Description should be at least 15 characters to help technicians diagnose.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSimulatedFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const allowedExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.pdf', '.txt', '.log'];
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedExts.includes(fileExt) && !file.type.startsWith('image/')) {
        alert('Invalid file format. Please attach an image (PNG, JPG), PDF, or text/log file.');
        e.target.value = '';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds the 10MB limit. Please select a smaller file.');
        e.target.value = '';
        return;
      }
      setFormData((prev) => ({
        ...prev,
        attachmentName: `${file.name} (${Math.round(file.size / 1024)} KB)`,
      }));
    }
  };

  const removeAttachment = () => {
    setFormData((prev) => ({ ...prev, attachmentName: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Auto assign department based on category
    let assignedDept = DEPARTMENTS[0];
    if (formData.category.includes('Wi-Fi') || formData.category.includes('LMS')) {
      assignedDept = 'IT Support & Network Operations';
    } else if (formData.category.includes('Hostel') || formData.category.includes('Dorm')) {
      assignedDept = 'Hostel Management Office';
    } else if (formData.category.includes('Library')) {
      assignedDept = 'Library Technical Services';
    } else if (formData.category.includes('Facilities') || formData.category.includes('Classroom')) {
      assignedDept = 'Campus Facilities & Civil Works';
    } else if (formData.category.includes('Security')) {
      assignedDept = 'Security & Campus Safety';
    } else if (formData.category.includes('Finance')) {
      assignedDept = 'Student Welfare Committee';
    }

    const newTicket = {
      id: generateTicketId(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
      status: 'Pending',
      studentName: formData.studentName.trim(),
      studentId: formData.studentId.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || 'N/A',
      location: formData.location,
      room: formData.room.trim() || 'General Area',
      assignedTo: assignedDept,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminNotes: 'Ticket received by system. Queued for department review.',
      attachmentName: formData.attachmentName || null,
    };

    setTimeout(() => {
      onSubmitSuccess(newTicket);
      setIsSubmitting(false);
      setSubmittedTicket(newTicket);
      setFormData(initialFormState);
    }, 300);
  };

  return (
    <div className="issue-form-wrapper">
      {/* Success Modal / Banner */}
      {submittedTicket && (
        <div className="submission-success-banner">
          <div className="success-banner-content">
            <div className="success-icon-badge">
              <IconCheckCircle size={32} />
            </div>
            <div className="success-text">
              <h4>Ticket #{submittedTicket.id} Submitted Successfully!</h4>
              <p>
                Your issue has been logged with status <strong>Pending</strong> and assigned to{' '}
                <strong>{submittedTicket.assignedTo}</strong>.
              </p>
              <div className="success-meta-row">
                <span>
                  <strong>Subject:</strong> {submittedTicket.title}
                </span>
                <span>
                  <strong>Reporter:</strong> {submittedTicket.studentName} ({submittedTicket.studentId})
                </span>
              </div>
            </div>
          </div>
          <div className="success-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigateToTrack(submittedTicket.id)}
            >
              Track This Ticket
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSubmittedTicket(null)}
            >
              Submit Another Issue
            </button>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <div className="card form-card">
        <div className="card-header form-card-header">
          <div className="form-heading-group">
            <span className="form-badge">Campus Support Portal</span>
            <h2>Submit a New Helpdesk Ticket</h2>
            <p className="card-subtitle">
              Need assistance with campus Wi-Fi, housing facilities, lab equipment, or portals?
              Fill out the details below to notify campus staff.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="helpdesk-form">
          {/* Section: Reporter Info */}
          <div className="form-section">
            <div className="section-title-row">
              <IconUser size={18} />
              <h3>1. Student & Contact Information</h3>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="studentName">
                  Full Name <span className="req">*</span>
                </label>
                <input
                  id="studentName"
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  className={errors.studentName ? 'input-error' : ''}
                />
                {errors.studentName && (
                  <span className="field-error-msg">
                    <IconAlertCircle size={13} /> {errors.studentName}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="studentId">
                  Student / Employee ID <span className="req">*</span>
                </label>
                <input
                  id="studentId"
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g. STU-2026-9012"
                  className={errors.studentId ? 'input-error' : ''}
                />
                {errors.studentId && (
                  <span className="field-error-msg">
                    <IconAlertCircle size={13} /> {errors.studentId}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="email">
                  University Email <span className="req">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@campus.edu"
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && (
                  <span className="field-error-msg">
                    <IconAlertCircle size={13} /> {errors.email}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone / Mobile (Optional)</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Section: Category, Priority, Location */}
          <div className="form-section">
            <div className="section-title-row">
              <IconTag size={18} />
              <h3>2. Issue Classification & Location</h3>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label htmlFor="category">
                  Category <span className="req">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priority">
                  Priority Level <span className="req">*</span>
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  {PRIORITY_LIST.map((pri) => (
                    <option key={pri} value={pri}>
                      {pri} Priority
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">
                  Campus Location / Building <span className="req">*</span>
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="room">Room / Exact Location Details (Optional)</label>
              <input
                id="room"
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                placeholder="e.g. Lab 302, Floor 2, North Wing Stairwell"
              />
            </div>
          </div>

          {/* Section: Subject & Description */}
          <div className="form-section">
            <div className="section-title-row">
              <IconBuilding size={18} />
              <h3>3. Problem Details</h3>
            </div>

            <div className="form-group">
              <label htmlFor="title">
                Subject / Summary <span className="req">*</span>
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief summary of the issue (e.g. Wi-Fi dropping in Library Study Hall 4)"
                className={errors.title ? 'input-error' : ''}
              />
              {errors.title && (
                <span className="field-error-msg">
                  <IconAlertCircle size={13} /> {errors.title}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Detailed Description <span className="req">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Please describe what happened, steps to reproduce, or specific equipment IDs involved..."
                className={errors.description ? 'input-error' : ''}
              />
              {errors.description && (
                <span className="field-error-msg">
                  <IconAlertCircle size={13} /> {errors.description}
                </span>
              )}
            </div>

            {/* Simulated file attachment */}
            <div className="form-group">
              <label className="attachment-label">
                <IconPaperclip size={16} /> Attach Screenshot or Error Log (Optional)
              </label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="attachmentInput"
                  onChange={handleSimulatedFileUpload}
                  className="hidden-file-input"
                  accept="image/*,.pdf,.txt,.log"
                />
                <label htmlFor="attachmentInput" className="file-picker-btn">
                  Choose File
                </label>
                {formData.attachmentName ? (
                  <span className="selected-filename-badge">
                    <span>{formData.attachmentName}</span>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={removeAttachment}
                      title="Remove file"
                    >
                      <IconX size={14} />
                    </button>
                  </span>
                ) : (
                  <span className="file-hint">PNG, JPG, PDF up to 10MB</span>
                )}
              </div>
            </div>
          </div>

          {/* Form Submit Footer */}
          <div className="form-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setFormData(initialFormState);
                setErrors({});
              }}
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="btn btn-primary submit-action-btn"
              disabled={isSubmitting}
            >
              <IconPlus size={18} />
              <span>{isSubmitting ? 'Registering Ticket...' : 'Submit Issue'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

