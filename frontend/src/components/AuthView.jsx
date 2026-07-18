import { useState } from 'react';
import { Api, TokenStore } from '../api.js';

export default function AuthView({ onAuthenticated }) {
  const [tab, setTab] = useState('login');

  return (
    <section className="auth-view">
      <div className="auth-card">
        <div className="brand">
          <span className="brand-mark">TF</span>
          <span className="brand-name">TaskFlow</span>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            Log in
          </button>
          <button
            type="button"
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
          >
            Sign up
          </button>
        </div>

        {tab === 'login' ? (
          <LoginForm onAuthenticated={onAuthenticated} />
        ) : (
          <RegisterForm onAuthenticated={onAuthenticated} />
        )}
      </div>
    </section>
  );
}

function LoginForm({ onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await Api.login(email, password);
      TokenStore.set(data.token);
      onAuthenticated();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <p className="form-error">{error}</p>
      <button type="submit" className="btn btn-primary">Log in</button>
    </form>
  );
}

function RegisterForm({ onAuthenticated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await Api.register(name, email, password);
      TokenStore.set(data.token);
      onAuthenticated();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Email
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="hint">At least 6 characters</span>
      </label>
      <p className="form-error">{error}</p>
      <button type="submit" className="btn btn-primary">Create account</button>
    </form>
  );
}
