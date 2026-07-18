const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const VALID_STATUS = ['todo', 'in_progress', 'done'];
const VALID_PRIORITY = ['low', 'medium', 'high'];

// GET /api/tasks?status=&priority=&category=&search=&sort=
router.get('/', (req, res) => {
  const { status, priority, category, search, sort } = req.query;

  let query = 'SELECT * FROM tasks WHERE user_id = ?';
  const params = [req.userId];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (search) {
    query += ' AND title LIKE ?';
    params.push(`%${search}%`);
  }

  const sortOptions = {
    due_date: 'due_date ASC',
    priority: "CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END",
    created: 'created_at DESC',
  };
  query += ` ORDER BY ${sortOptions[sort] || 'created_at DESC'}`;

  const tasks = db.prepare(query).all(...params);
  res.json({ tasks });
});

router.get('/stats/summary', (req, res) => {
  const userId = req.userId;
  const total = db.prepare('SELECT COUNT(*) c FROM tasks WHERE user_id = ?').get(userId).c;
  const done = db.prepare("SELECT COUNT(*) c FROM tasks WHERE user_id = ? AND status = 'done'").get(userId).c;
  const inProgress = db
    .prepare("SELECT COUNT(*) c FROM tasks WHERE user_id = ? AND status = 'in_progress'")
    .get(userId).c;
  const todo = db.prepare("SELECT COUNT(*) c FROM tasks WHERE user_id = ? AND status = 'todo'").get(userId).c;
  const overdue = db
    .prepare(
      "SELECT COUNT(*) c FROM tasks WHERE user_id = ? AND status != 'done' AND due_date IS NOT NULL AND due_date < date('now')"
    )
    .get(userId).c;
  const dueSoon = db
    .prepare(
      "SELECT COUNT(*) c FROM tasks WHERE user_id = ? AND status != 'done' AND due_date IS NOT NULL AND due_date BETWEEN date('now') AND date('now', '+7 days')"
    )
    .get(userId).c;

  res.json({ total, done, inProgress, todo, overdue, dueSoon });
});

router.get('/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ task });
});

router.post('/', (req, res) => {
  const { title, description, status, priority, category, due_date } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (status && !VALID_STATUS.includes(status)) {
    return res.status(400).json({ error: `status must be one of ${VALID_STATUS.join(', ')}` });
  }
  if (priority && !VALID_PRIORITY.includes(priority)) {
    return res.status(400).json({ error: `priority must be one of ${VALID_PRIORITY.join(', ')}` });
  }

  const info = db
    .prepare(
      `INSERT INTO tasks (user_id, title, description, status, priority, category, due_date, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    )
    .run(
      req.userId,
      title.trim(),
      description || '',
      status || 'todo',
      priority || 'medium',
      category || '',
      due_date || null
    );

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ task });
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!existing) return res.status(404).json({ error: 'Task not found' });

  const { title, description, status, priority, category, due_date } = req.body;

  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }
  if (status && !VALID_STATUS.includes(status)) {
    return res.status(400).json({ error: `status must be one of ${VALID_STATUS.join(', ')}` });
  }
  if (priority && !VALID_PRIORITY.includes(priority)) {
    return res.status(400).json({ error: `priority must be one of ${VALID_PRIORITY.join(', ')}` });
  }

  db.prepare(
    `UPDATE tasks SET
      title = ?, description = ?, status = ?, priority = ?, category = ?, due_date = ?, updated_at = datetime('now')
     WHERE id = ? AND user_id = ?`
  ).run(
    title !== undefined ? title.trim() : existing.title,
    description !== undefined ? description : existing.description,
    status || existing.status,
    priority || existing.priority,
    category !== undefined ? category : existing.category,
    due_date !== undefined ? due_date : existing.due_date,
    req.params.id,
    req.userId
  );

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json({ task });
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
});

module.exports = router;
