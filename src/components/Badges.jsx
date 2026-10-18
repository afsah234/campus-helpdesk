import { IconClock, IconRefreshCw, IconCheckCircle, IconAlertTriangle } from './Icons';

export function StatusBadge({ status, size = 'md' }) {
  const norm = (status || '').toLowerCase();

  let config = {
    className: 'badge-pending',
    label: 'Pending',
    icon: <IconClock size={size === 'sm' ? 12 : 14} />,
  };

  if (norm.includes('progress')) {
    config = {
      className: 'badge-progress',
      label: 'In Progress',
      icon: <IconRefreshCw size={size === 'sm' ? 12 : 14} />,
    };
  } else if (norm.includes('resolve')) {
    config = {
      className: 'badge-resolved',
      label: 'Resolved',
      icon: <IconCheckCircle size={size === 'sm' ? 12 : 14} />,
    };
  }

  return (
    <span className={`status-badge ${config.className} size-${size}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}

export function PriorityBadge({ priority, size = 'md' }) {
  const p = (priority || 'medium').toLowerCase();
  let className = 'priority-medium';

  if (p === 'urgent') className = 'priority-urgent';
  else if (p === 'high') className = 'priority-high';
  else if (p === 'low') className = 'priority-low';

  return (
    <span className={`priority-badge ${className} size-${size}`}>
      {p === 'urgent' && <IconAlertTriangle size={size === 'sm' ? 12 : 14} />}
      <span>{priority}</span>
    </span>
  );
}

