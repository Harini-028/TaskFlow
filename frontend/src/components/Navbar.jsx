import { Link } from "react-router-dom";

export function Avatar({ name, className = "" }) {
  return <span className={`avatar ${className}`.trim()}>{name?.trim()?.[0]?.toUpperCase() || "U"}</span>;
}

export default function Navbar({ title, user, searchValue, onSearchChange }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <span className="eyebrow">YOUR SPACE</span>
        <h2>{title}</h2>
      </div>

      <div className="topbar-right">
        <label className="search-box nav-search-box" aria-label="Search tasks">
          <span>⌕</span>
          <input
            value={searchValue || ""}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder="Search tasks..."
          />
        </label>

        <button className="icon-button" type="button" aria-label="Notifications">
          🔔
        </button>

        <Link to="/profile" className="profile-chip">
          <Avatar name={user?.name} />
          <span>{user?.name?.split(" ")[0] || "Account"}</span>
        </Link>
      </div>
    </header>
  );
}
