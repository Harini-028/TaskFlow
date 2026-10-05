import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function SettingsPage() {
  const { theme, setTheme } = useOutletContext();
  const [notifications, setNotifications] = useState(() => localStorage.getItem("taskflow-notifications") !== "off");

  const applyTheme = (nextTheme) => {
    setTheme(nextTheme);
    localStorage.setItem("taskflow-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  };

  const toggleNotifications = (event) => {
    const nextValue = event.target.checked;
    setNotifications(nextValue);
    localStorage.setItem("taskflow-notifications", nextValue ? "on" : "off");
  };

  return (
    <>
      <section className="page-intro">
        <div>
          <span className="eyebrow">MAKE IT YOURS</span>
          <h1>Settings</h1>
          <p className="muted">A few choices for how TaskFlow feels and works.</p>
        </div>
      </section>

      <div className="settings-list">
        <section className="setting-section">
          <div className="setting-section-title">
            <span className="setting-icon">◐</span>
            <div>
              <h2>Appearance</h2>
              <p>Choose a comfortable workspace theme.</p>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Dark mode</strong>
              <span>Use a darker palette across TaskFlow.</span>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={theme === "dark"} onChange={(event) => applyTheme(event.target.checked ? "dark" : "light")} />
              <span />
            </label>
          </div>
        </section>

        <section className="setting-section">
          <div className="setting-section-title">
            <span className="setting-icon">◎</span>
            <div>
              <h2>Notifications</h2>
              <p>Choose what you&apos;d like to receive.</p>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Task updates</strong>
              <span>Show an in-app confirmation when tasks change.</span>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={notifications} onChange={toggleNotifications} />
              <span />
            </label>
          </div>
        </section>

        <section className="setting-section">
          <div className="setting-section-title">
            <span className="setting-icon">⌑</span>
            <div>
              <h2>Security</h2>
              <p>Your account and tasks are protected.</p>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Private workspace</strong>
              <span>Only your account can access your tasks.</span>
            </div>
            <span className="security-pill"><i /> Protected</span>
          </div>
        </section>
      </div>
    </>
  );
}
