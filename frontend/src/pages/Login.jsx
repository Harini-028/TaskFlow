import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";

export default function LoginPage({ user, setUser, notify }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      notify("Login successful");
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Unable to connect to server");
      setError(message || "Invalid email or password");
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
          <span className="eyebrow">MAKE ROOM FOR FOCUS</span>
          <h1>
            Good work
            <br />
            starts with a
            <br />
            <em>clear next step.</em>
          </h1>
          <p>One calm place for the tasks that move your day forward.</p>
          <div className="story-stats">
            <span><b>01</b> Capture what matters</span>
            <span><b>02</b> Keep your momentum</span>
            <span><b>03</b> Finish with clarity</span>
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
          <h2>Welcome back</h2>
          <p className="muted">Sign in to pick up where you left off.</p>

          <form onSubmit={handleSubmit}>
            <label className="field-label">
              Email address
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required />
            </label>

            <label className="field-label">
              Password
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" autoComplete="current-password" required />
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="button button-primary auth-submit" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="auth-switch">
            New to TaskFlow?
            <Link to="/register">Create an account</Link>
          </p>
          <p className="auth-note">Your tasks are private to your account.</p>
        </div>
      </section>
    </main>
  );
}
