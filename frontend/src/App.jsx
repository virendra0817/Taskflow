import { useCallback, useEffect, useState } from 'react';
import { Api, TokenStore } from './api.js';
import AuthView from './components/AuthView.jsx';
import TopBar from './components/TopBar.jsx';
import StatsRow from './components/StatsRow.jsx';
import Toolbar from './components/Toolbar.jsx';
import Board from './components/Board.jsx';
import TaskModal from './components/TaskModal.jsx';

const EMPTY_STATS = { total: 0, done: 0, inProgress: 0, todo: 0, overdue: 0, dueSoon: 0 };

export default function App() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [filters, setFilters] = useState({ priority: '', search: '', sort: 'created' });
  const [modalTask, setModalTask] = useState(undefined); // undefined = closed, null = new task, object = edit

  const refreshStats = useCallback(async () => {
    const data = await Api.stats();
    setStats(data);
  }, []);

  const refreshTasks = useCallback(async () => {
    const data = await Api.listTasks(filters);
    setTasks(data.tasks);
  }, [filters]);

  const bootApp = useCallback(async () => {
    try {
      const { user: me } = await Api.me();
      setUser(me);
    } catch (err) {
      TokenStore.clear();
      setUser(null);
    } finally {
      setBooting(false);
    }
  }, []);

  useEffect(() => {
    if (TokenStore.get()) {
      bootApp();
    } else {
      setBooting(false);
    }
  }, [bootApp]);

  useEffect(() => {
    if (user) {
      refreshStats();
      refreshTasks();
    }
  }, [user, refreshTasks, refreshStats]);

  function handleAuthenticated() {
    setBooting(true);
    bootApp();
  }

  function handleLogout() {
    TokenStore.clear();
    setUser(null);
    setTasks([]);
    setStats(EMPTY_STATS);
  }

  async function handleStatusChange(task, status) {
    await Api.updateTask(task.id, { status });
    await Promise.all([refreshStats(), refreshTasks()]);
  }

  async function handleSaveTask(id, payload) {
    if (id) {
      await Api.updateTask(id, payload);
    } else {
      await Api.createTask(payload);
    }
    setModalTask(undefined);
    await Promise.all([refreshStats(), refreshTasks()]);
  }

  async function handleDeleteTask(id) {
    await Api.deleteTask(id);
    setModalTask(undefined);
    await Promise.all([refreshStats(), refreshTasks()]);
  }

  if (booting) return null;

  if (!user) {
    return <AuthView onAuthenticated={handleAuthenticated} />;
  }

  return (
    <section className="app-view">
      <TopBar user={user} onLogout={handleLogout} />
      <main className="main">
        <StatsRow stats={stats} />
        <Toolbar
          filters={filters}
          onFiltersChange={setFilters}
          onNewTask={() => setModalTask(null)}
        />
        <Board tasks={tasks} onOpenTask={setModalTask} onStatusChange={handleStatusChange} />
      </main>

      {modalTask !== undefined && (
        <TaskModal
          task={modalTask}
          onClose={() => setModalTask(undefined)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}
    </section>
  );
}
