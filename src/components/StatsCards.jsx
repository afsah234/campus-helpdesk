import {
  IconInbox,
  IconClock,
  IconRefreshCw,
  IconCheckCircle,
  IconAlertTriangle,
} from './Icons';

export function StatsCards({
  tickets = [],
  activeStatusFilter = 'All',
  onFilterByStatus,
  activePriorityFilter = 'All',
  onFilterByPriority,
}) {
  const total = tickets.length;
  const pending = tickets.filter((t) => t.status === 'Pending').length;
  const inProgress = tickets.filter((t) => t.status === 'In Progress').length;
  const resolved = tickets.filter((t) => t.status === 'Resolved').length;
  const urgentCount = tickets.filter(
    (t) => (t.priority === 'Urgent' || t.priority === 'High') && t.status !== 'Resolved'
  ).length;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const cards = [
    {
      id: 'All',
      type: 'status',
      label: 'Total Tickets',
      value: total,
      subtext: 'All campus departments',
      icon: <IconInbox size={22} />,
      accentClass: 'stat-total',
      clickable: true,
    },
    {
      id: 'Pending',
      type: 'status',
      label: 'Pending Review',
      value: pending,
      subtext: 'Awaiting initial action',
      icon: <IconClock size={22} />,
      accentClass: 'stat-pending',
      clickable: true,
    },
    {
      id: 'In Progress',
      type: 'status',
      label: 'In Progress',
      value: inProgress,
      subtext: 'Actively handled by teams',
      icon: <IconRefreshCw size={22} />,
      accentClass: 'stat-progress',
      clickable: true,
    },
    {
      id: 'Resolved',
      type: 'status',
      label: 'Resolved',
      value: resolved,
      subtext: `${resolutionRate}% resolution rate`,
      icon: <IconCheckCircle size={22} />,
      accentClass: 'stat-resolved',
      clickable: true,
    },
    {
      id: 'Urgent',
      type: 'priority',
      label: 'Urgent / High Priority',
      value: urgentCount,
      subtext: 'Requires immediate attention',
      icon: <IconAlertTriangle size={22} />,
      accentClass: 'stat-urgent',
      clickable: Boolean(onFilterByPriority),
    },
  ];

  const handleCardClick = (card) => {
    if (!card.clickable) return;
    if (card.type === 'priority' && onFilterByPriority) {
      onFilterByPriority(card.id);
    } else if (card.type === 'status' && onFilterByStatus) {
      onFilterByStatus(card.id);
    }
  };

  return (
    <div className="stats-grid">
      {cards.map((card) => {
        const isSelected =
          card.type === 'status'
            ? activeStatusFilter === card.id && activePriorityFilter === 'All'
            : activePriorityFilter === card.id;

        return (
          <div
            key={card.label}
            className={`stat-card ${card.accentClass} ${isSelected ? 'selected' : ''} ${
              card.clickable ? 'clickable' : ''
            }`}
            onClick={() => handleCardClick(card)}
            role={card.clickable ? 'button' : undefined}
            tabIndex={card.clickable ? 0 : undefined}
            title={card.clickable ? `Filter by ${card.label}` : undefined}
            onKeyDown={(e) => {
              if (card.clickable && (e.key === 'Enter' || e.key === ' ')) {
                handleCardClick(card);
              }
            }}
          >
            <div className="stat-card-header">
              <span className="stat-label">{card.label}</span>
              <div className="stat-icon-wrapper">{card.icon}</div>
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-subtext">{card.subtext}</div>
          </div>
        );
      })}
    </div>
  );
}

