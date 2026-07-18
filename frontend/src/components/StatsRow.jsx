export default function StatsRow({ stats }) {
  return (
    <div className="stats-row">
      <div className="stat-card">
        <span className="stat-value">{stats.total}</span>
        <span className="stat-label">Total tasks</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{stats.inProgress}</span>
        <span className="stat-label">In progress</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{stats.done}</span>
        <span className="stat-label">Completed</span>
      </div>
      <div className="stat-card stat-warn">
        <span className="stat-value">{stats.overdue}</span>
        <span className="stat-label">Overdue</span>
      </div>
      <div className="stat-card stat-info">
        <span className="stat-value">{stats.dueSoon}</span>
        <span className="stat-label">Due in 7 days</span>
      </div>
    </div>
  );
}
