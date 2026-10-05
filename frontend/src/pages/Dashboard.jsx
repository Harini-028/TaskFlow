import { Link, useOutletContext } from "react-router-dom";
import StatsCard from "../components/StatsCard";

export default function DashboardPage() {
  const { user, tasks, loading, error, openTask } = useOutletContext();

  const counts = {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
  };

  const progress = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 4);

  return (
    <>
      <section className="welcome-row">
        <div>
          <span className="eyebrow">{new Intl.DateTimeFormat("en", { dateStyle: "full" }).format(new Date())}</span>
          <h1>
            Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="muted">Here&apos;s what&apos;s happening with your tasks today.</p>
        </div>

        <button className="button button-primary" onClick={() => openTask()}>
          <span>＋</span>
          Add Task
        </button>
      </section>

      {error && <div className="error-banner" role="alert"><span>!</span><div><strong>We couldn&apos;t load your workspace.</strong><p>{error}</p></div></div>}

      <section className="stats-grid" aria-label="Task statistics">
        <StatsCard label="Total Tasks" value={counts.total} tone="mint" loading={loading} />
        <StatsCard label="Pending" value={counts.pending} tone="peach" loading={loading} />
        <StatsCard label="In Progress" value={counts.inProgress} tone="blue" loading={loading} />
        <StatsCard label="Completed" value={counts.completed} tone="lilac" loading={loading} />
      </section>

      <section className="dashboard-grid">
        <div className="progress-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR MOMENTUM</span>
              <h2>Overall Progress</h2>
            </div>
            <span className="progress-percent">{progress}%</span>
          </div>

          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="progress-caption">
            <span>{counts.completed} of {counts.total} tasks completed</span>
            <span>{progress === 100 && counts.total ? "All done" : "Keep going"}</span>
          </div>

          <div className="progress-footnote">
            {counts.total ? "Every finished task is a step forward." : "Your progress will appear here once you add tasks."}
          </div>
        </div>

        <div className="focus-panel">
          <span className="focus-mark">✳</span>
          <span className="eyebrow">A SMALL REMINDER</span>
          <h3>Make space for the work that matters.</h3>
          <p>Keep your next step clear, and let the rest wait its turn.</p>
        </div>
      </section>

      <section className="recent-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">RECENT ACTIVITY</span>
            <h2>Recent Tasks</h2>
          </div>
          <Link className="text-link" to="/tasks">
            View All Tasks <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="task-list">
            {[0, 1, 2].map((item) => <div className="skeleton-row" key={item} />)}
          </div>
        ) : recentTasks.length ? (
          <div className="task-list">
            {recentTasks.map((task) => (
              <article className="task-row" key={task._id}>
                <div className={`task-check status-${task.status}`}>
                  {task.status === "completed" ? "✓" : task.status === "in-progress" ? "·" : ""}
                </div>

                <div className="task-main">
                  <div className="task-title-line">
                    <h3>{task.title}</h3>
                    <span className={`priority-tag priority-${task.priority}`}>{task.priority}</span>
                  </div>
                  {task.description && <p>{task.description}</p>}
                  <div className="task-meta">
                    <span className={`status-label label-${task.status}`}>{task.status === "in-progress" ? "In progress" : task.status}</span>
                    <span>Due {new Date(task.dueDate || task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state empty-compact">
            <h2>No tasks yet</h2>
            <p>Create your first task and start getting things done.</p>
            <button className="button button-primary" onClick={() => openTask()}><span>＋</span> Create Task</button>
          </div>
        )}
      </section>
    </>
  );
}
