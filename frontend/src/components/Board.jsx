import TaskCard from './TaskCard.jsx';

const COLUMNS = [
  { status: 'todo', title: 'To Do' },
  { status: 'in_progress', title: 'In Progress' },
  { status: 'done', title: 'Done' },
];

export default function Board({ tasks, onOpenTask, onStatusChange }) {
  const grouped = { todo: [], in_progress: [], done: [] };
  tasks.forEach((t) => grouped[t.status]?.push(t));

  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet. Create your first one above.</p>;
  }

  return (
    <div className="board">
      {COLUMNS.map((col) => (
        <div className="board-col" key={col.status} data-status={col.status}>
          <h3 className="board-col-title">
            {col.title} <span className="count">{grouped[col.status].length}</span>
          </h3>
          <div className="board-col-body">
            {grouped[col.status].map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onOpen={onOpenTask}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
