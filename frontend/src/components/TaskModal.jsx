import { useEffect, useState } from 'react';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  category: '',
  due_date: '',
};

export default function TaskModal({ task, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        category: task.category || '',
        due_date: task.due_date || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [task]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await onSave(task ? task.id : null, {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        category: form.category.trim(),
        due_date: form.due_date || null,
      });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!task) return;
    if (!confirm('Delete this task? This cannot be undone.')) return;
    await onDelete(task.id);
  }

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <div className="modal-header">
          <h3>{task ? 'Edit task' : 'New task'}</h3>
          <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </label>
          <div className="form-row">
            <label>
              Status
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <label>
              Priority
              <select value={form.priority} onChange={(e) => update('priority', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              Category
              <input
                type="text"
                placeholder="e.g. Work"
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
              />
            </label>
            <label>
              Due date
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => update('due_date', e.target.value)}
              />
            </label>
          </div>
          <p className="form-error">{error}</p>
          <div className="modal-actions">
            {task ? (
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            ) : (
              <span />
            )}
            <button type="submit" className="btn btn-primary">Save task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
