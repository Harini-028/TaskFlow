export default function StatsCard({ label, value, tone = "lilac", loading = false }) {
  const markers = { mint: "01", peach: "02", blue: "03", lilac: "04" };

  return (
    <article className={`stat-card stat-${tone}`}>
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-marker">{markers[tone] || "01"}</span>
      </div>
      <strong>{loading ? <i className="value-skeleton" /> : value}</strong>
      <span className="stat-foot">PERSONAL OVERVIEW</span>
    </article>
  );
}
