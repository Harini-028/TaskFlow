import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { Avatar } from "../components/Navbar";

export default function ProfilePage() {
  const { notify, setUser } = useOutletContext();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/protected/profile")
      .then(({ data }) => {
        setProfile(data.user);
        setForm({ name: data.user.name, email: data.user.email });
      })
      .catch((requestError) => {
        setError(getErrorMessage(requestError, "Unable to load profile"));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const { data } = await api.put("/api/protected/profile", form);
      setProfile(data.user);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setEditing(false);
      notify("Profile updated successfully");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not update profile"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-loading"><div className="skeleton-row" /></div>;
  }

  return (
    <>
      <section className="page-intro">
        <div>
          <span className="eyebrow">YOUR DETAILS</span>
          <h1>Profile</h1>
          <p className="muted">The basics behind your TaskFlow account.</p>
        </div>
        {!editing && <button className="button button-outline" onClick={() => setEditing(true)}>Edit profile</button>}
      </section>

      {error && <div className="error-banner" role="alert"><span>!</span><div><strong>We couldn&apos;t load your workspace.</strong><p>{error}</p></div></div>}

      <section className="profile-panel">
        <div className="profile-identity">
          <Avatar name={profile?.name} />
          <div>
            <h2>{profile?.name}</h2>
            <span>{profile?.email}</span>
          </div>
        </div>

        {editing ? (
          <form className="profile-form" onSubmit={handleSubmit}>
            <label className="field-label">
              Full name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required maxLength="80" />
            </label>

            <label className="field-label">
              Email address
              <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </label>

            <div className="modal-actions">
              <button type="button" className="button button-quiet" onClick={() => { setEditing(false); setForm({ name: profile.name, email: profile.email }); }}>
                Cancel
              </button>
              <button className="button button-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div>
              <span>Full name</span>
              <strong>{profile?.name}</strong>
            </div>
            <div>
              <span>Email address</span>
              <strong>{profile?.email}</strong>
            </div>
            <div>
              <span>Account created</span>
              <strong>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}</strong>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
