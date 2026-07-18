export default function TopBar({ user, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">TF</span>
        <span className="brand-name">TaskFlow</span>
      </div>
      <div className="topbar-right">
        <span className="user-name">{user?.name}</span>
        <button type="button" className="btn btn-ghost" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
