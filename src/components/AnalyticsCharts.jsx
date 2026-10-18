import {
  CATEGORIES,
  PRIORITY_LIST,
} from '../constants/issueData';
import { IconBarChart, IconBuilding, IconAlertTriangle } from './Icons';

export function AnalyticsCharts({ tickets = [] }) {
  const total = tickets.length;

  // Status breakdown
  const pendingCount = tickets.filter((t) => t.status === 'Pending').length;
  const progressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

  const pendingPct = total > 0 ? Math.round((pendingCount / total) * 100) : 0;
  const progressPct = total > 0 ? Math.round((progressCount / total) * 100) : 0;
  const resolvedPct = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  // Proportional bar segment widths for visual accuracy
  const pendingWidth = total > 0 ? (pendingCount / total) * 100 : 0;
  const progressWidth = total > 0 ? (progressCount / total) * 100 : 0;
  const resolvedWidth = total > 0 ? (resolvedCount / total) * 100 : 0;

  // Category breakdown
  const categoryCounts = CATEGORIES.map((cat) => {
    const count = tickets.filter((t) => t.category === cat).length;
    return {
      category: cat,
      count,
      pct: total ? Math.round((count / total) * 100) : 0,
    };
  })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  // Priority breakdown
  const priorityCounts = PRIORITY_LIST.map((pri) => {
    const count = tickets.filter((t) => t.priority === pri).length;
    return {
      priority: pri,
      count,
      pct: total ? Math.round((count / total) * 100) : 0,
    };
  });

  return (
    <div className="analytics-section">
      <div className="analytics-header">
        <div className="analytics-title">
          <IconBarChart size={20} />
          <h3>Helpdesk Analytics & Resolution Metrics</h3>
        </div>
        <span className="analytics-total-badge">{total} Total Tickets Analyzed</span>
      </div>

      <div className="analytics-grid">
        {/* Status Distribution Breakdown */}
        <div className="analytics-card">
          <div className="analytics-card-title">
            <span>Status Pipeline Overview</span>
          </div>

          <div className="status-progress-track" title={`Pending: ${pendingPct}%, In Progress: ${progressPct}%, Resolved: ${resolvedPct}%`}>
            {pendingWidth > 0 && (
              <div
                className="status-bar-seg seg-pending"
                style={{ width: `${pendingWidth}%` }}
                title={`Pending: ${pendingCount} (${pendingPct}%)`}
              />
            )}
            {progressWidth > 0 && (
              <div
                className="status-bar-seg seg-progress"
                style={{ width: `${progressWidth}%` }}
                title={`In Progress: ${progressCount} (${progressPct}%)`}
              />
            )}
            {resolvedWidth > 0 && (
              <div
                className="status-bar-seg seg-resolved"
                style={{ width: `${resolvedWidth}%` }}
                title={`Resolved: ${resolvedCount} (${resolvedPct}%)`}
              />
            )}
          </div>

          <div className="status-legend">
            <div className="legend-item">
              <span className="dot dot-pending" />
              <span className="legend-name">Pending</span>
              <span className="legend-value">{pendingCount} ({pendingPct}%)</span>
            </div>
            <div className="legend-item">
              <span className="dot dot-progress" />
              <span className="legend-name">In Progress</span>
              <span className="legend-value">{progressCount} ({progressPct}%)</span>
            </div>
            <div className="legend-item">
              <span className="dot dot-resolved" />
              <span className="legend-name">Resolved</span>
              <span className="legend-value">{resolvedCount} ({resolvedPct}%)</span>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="analytics-card">
          <div className="analytics-card-title">
            <IconAlertTriangle size={16} />
            <span>Priority Level Breakdown</span>
          </div>

          <div className="priority-bars-container">
            {priorityCounts.map((item) => (
              <div key={item.priority} className="priority-bar-row">
                <div className="priority-bar-label">
                  <span className={`priority-indicator pri-${item.priority.toLowerCase()}`} />
                  <span className="pri-name">{item.priority}</span>
                  <span className="pri-count">{item.count}</span>
                </div>
                <div className="bar-bg">
                  <div
                    className={`bar-fill fill-${item.priority.toLowerCase()}`}
                    style={{ width: `${Math.max(item.pct, item.count > 0 ? 6 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="analytics-card category-analytics-card">
          <div className="analytics-card-title">
            <IconBuilding size={16} />
            <span>Active Issues by Category</span>
          </div>

          <div className="category-list-scroll">
            {categoryCounts.length === 0 ? (
              <p className="no-data-msg">No active categories recorded.</p>
            ) : (
              categoryCounts.map((item) => (
                <div key={item.category} className="category-item-row">
                  <div className="category-item-info">
                    <span className="category-name">{item.category}</span>
                    <span className="category-count">{item.count} tickets ({item.pct}%)</span>
                  </div>
                  <div className="category-bar-bg">
                    <div
                      className="category-bar-fill"
                      style={{ width: `${Math.max(item.pct, 8)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

