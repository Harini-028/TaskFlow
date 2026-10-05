import { Link, NavLink } from "react-router-dom";

function Avatar({ name }) {
  return <span className="avatar">{name?.trim()?.[0]?.toUpperCase() || "U"}</span>;
}

export default function Sidebar({ user, onLogout, menuOpen, onToggleMenu }) {
  return (
    <>
      {menuOpen && <button aria-label="Close navigation" className="mobile-scrim" onClick={onToggleMenu} />}
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <Link className="brand sidebar-brand" to="/dashboard">
          <span className="brand-mark">T</span>
          <span>TaskFlow</span>
        </Link>

        <span className="nav-caption">WORKSPACE</span>
        <nav className="side-nav">
          <NavLink to="/dashboard"><span className="nav-symbol">◫</span>Dashboard</NavLink>
          <NavLink to="/tasks"><span className="nav-symbol">✓</span>My Tasks</NavLink>
          <span className="nav-caption nav-caption-spaced">PERSONAL</span>
          <NavLink to="/profile"><span className="nav-symbol">○</span>Profile</NavLink>
          <NavLink to="/settings"><span className="nav-symbol">⚙</span>Settings</NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <Avatar name={user?.name} />
            <div>
              <strong>{user?.name || "Your account"}</strong>
              <span>Personal space</span>
            </div>
          </div>

          <button className="logout-button" onClick={onLogout}>
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
