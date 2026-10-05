import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";

export default function RegisterPage({ notify }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;

    if (!name) {
      setError("Full name is required");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/register", { name, email, password });
      notify?.("Registration successful");
      navigate("/login", { replace: true });
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Unable to connect to server");
      setError(message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-story">
        <Link className="brand" to="/login">
          <span className="brand-mark">T</span>
          <span>TaskFlow</span>
        </Link>

        <div className="story-copy">
          <span className="eyebrow">BUILD A STRONGER ROUTINE</span>
          <h1>
            Start smart.
            <br />
            Plan clearly.
            <br />
            <em>Finish calmly.</em>
          </h1>
          <p>Capture priorities, avoid overwhelm, and keep your work moving forward.</p>
          <div className="story-stats">
            <span><b>01</b> Organize your tasks</span>
            <span><b>02</b> Set clear priorities</span>
            <span><b>03</b> Stay focused</span>
          </div>
        </div>

        <span className="story-footer">PERSONAL WORKSPACE · TASKFLOW</span>
      </section>

      <section className="auth-form-side">
        <div className="auth-card">
          <Link className="brand mobile-brand" to="/login">
            <span className="brand-mark">T</span>
            <span>TaskFlow</span>
          </Link>

          <span className="eyebrow">YOUR WORKSPACE AWAITS</span>
          <h2>Create your account</h2>
          <p className="muted">Set up your personal task space in a moment.</p>

          <form onSubmit={handleSubmit}>
            <label className="field-label">
              Full Name
              <input name="name" value={form.name} onChange={handleChange} placeholder="Harini Kumar" autoComplete="name" required />
            </label>

            <label className="field-label">
              Email
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required />
            </label>

            <label className="field-label">
              Password
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" autoComplete="new-password" minLength="6" required />
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="button button-primary auth-submit" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </p>
          <p className="auth-note">Your tasks are private to your account.</p>
        </div>
      </section>
    </main>
  );
}
