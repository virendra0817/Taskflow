/**
 * Lightweight smoke tests for the TaskFlow API.
 * Run with: npm test  (server must NOT already be running on PORT)
 * Spins up the app in-process against a throwaway test database.
 */
process.env.NODE_ENV = 'test';

const path = require('path');
const fs = require('fs');

// Use an isolated DB file for tests so we never touch dev data
const testDbDir = path.join(__dirname, '..', 'data');
const testDbPath = path.join(testDbDir, 'test.db');
if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
process.env.TASKFLOW_DB_PATH = testDbPath;

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  \u2713 ${message}`);
  } else {
    failed++;
    console.error(`  \u2717 ${message}`);
  }
}

async function main() {
  const { spawn } = require('child_process');
  const PORT = 4321;
  const env = { ...process.env, PORT: String(PORT) };

  const server = spawn('node', [path.join(__dirname, '..', 'server.js')], { env });
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const base = `http://localhost:${PORT}`;
  const email = `smoketest_${Date.now()}@example.com`;

  try {
    // Register
    let res = await fetch(`${base}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Smoke Test', email, password: 'password123' }),
    });
    let data = await res.json();
    assert(res.status === 201 && data.token, 'register returns 201 + token');
    const token = data.token;
    const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    // Duplicate register should fail
    res = await fetch(`${base}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Dup', email, password: 'password123' }),
    });
    assert(res.status === 409, 'duplicate email registration rejected with 409');

    // Login with wrong password
    res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'wrongpassword' }),
    });
    assert(res.status === 401, 'wrong password login rejected with 401');

    // Create task
    res = await fetch(`${base}/api/tasks`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ title: 'Write tests', priority: 'high' }),
    });
    data = await res.json();
    assert(res.status === 201 && data.task.id, 'task creation returns 201 + id');
    const taskId = data.task.id;

    // Empty title rejected
    res = await fetch(`${base}/api/tasks`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ title: '   ' }),
    });
    assert(res.status === 400, 'empty title on create rejected with 400');

    // PUT empty title rejected (regression test for the bug fixed in this commit)
    res = await fetch(`${base}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ title: '' }),
    });
    assert(res.status === 400, 'PUT with empty title rejected with 400 (regression check)');

    // Status update works
    res = await fetch(`${base}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ status: 'done' }),
    });
    data = await res.json();
    assert(res.status === 200 && data.task.status === 'done', 'status-only update succeeds');

    // Stats reflect the change
    res = await fetch(`${base}/api/tasks/stats/summary`, { headers: authHeaders });
    data = await res.json();
    assert(data.done === 1, 'stats summary reflects completed task');

    // No auth header blocked
    res = await fetch(`${base}/api/tasks`);
    assert(res.status === 401, 'unauthenticated request to /api/tasks rejected with 401');

    // Cross-user isolation
    const email2 = `smoketest2_${Date.now()}@example.com`;
    res = await fetch(`${base}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Other User', email: email2, password: 'password123' }),
    });
    data = await res.json();
    const token2 = data.token;
    res = await fetch(`${base}/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token2}` },
    });
    assert(res.status === 404, "user B cannot access user A's task (isolation holds)");

    // Delete
    res = await fetch(`${base}/api/tasks/${taskId}`, { method: 'DELETE', headers: authHeaders });
    assert(res.status === 204, 'delete returns 204');
  } finally {
    server.kill();
    await new Promise(resolve => setTimeout(resolve, 500));

    try { if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath); } catch (_) {}
    try { if (fs.existsSync(testDbPath + '-wal')) fs.unlinkSync(testDbPath + '-wal'); } catch (_) {}
    try { if (fs.existsSync(testDbPath + '-shm')) fs.unlinkSync(testDbPath + '-shm'); } catch (_) {}
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
