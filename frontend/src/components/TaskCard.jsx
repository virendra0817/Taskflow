function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function DueBadge({ task }) {
  if (!task.due_date || task.status === 'done') return null;
  const today = todayISO();
  const in7 = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  if (task.due_date < today) {
    return <span className="badge due-overdue">overdue · {task.due_date}</span>;
  }
  if (task.due_date <= in7) {
    return <span className="badge due-soon">due {task.due_date}</span>;
  }
  return <span className="badge">due {task.due_date}</span>;
}

export default function TaskCard({ task, onOpen, onStatusChange }) {
  const isOverdue = task.due_date && task.due_date < todayISO() && task.status !== 'done';

  return (
    <div
      className={`task-card ${isOverdue ? 'overdue' : ''}`}
      data-priority={task.priority}
      onClick={() => onOpen(task)}
    >
      <div className="task-title">{task.title}</div>
      <div className="task-meta">
        <span className="badge">{task.priority}</span>
        {task.category ? <span className="badge">{task.category}</span> : null}
        <DueBadge task={task} />
      </div>
      <div className="status-buttons" onClick={(e) => e.stopPropagation()}>
        {['todo', 'in_progress', 'done'].map((status) => (
          <button
            key={status}
            type="button"
            className={task.status === status ? 'current' : ''}
            onClick={() => onStatusChange(task, status)}
          >
            {status === 'todo' ? 'To Do' : status === 'in_progress' ? 'In Progress' : 'Done'}
          </button>
        ))}
      </div>
    </div>
  );
}
