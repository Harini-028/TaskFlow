import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import TaskCard from "../components/TaskCard";

export default function TasksPage() {
  const { tasks, loading, error, openTask, deleteTask, changeStatus } = useOutletContext();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [sort, setSort] = useState("newest");

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const q = search.trim().toLowerCase();
      const matchesQuery = !q || `${task.title} ${task.description || ""}`.toLowerCase().includes(q);
      const matchesStatus = status === "all" || task.status === status;
      const matchesPriority = priority === "all" || task.priority === priority;
      return matchesQuery && matchesStatus && matchesPriority;
    });

    return filtered.sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "due") return (a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000)) - (b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000));
      if (sort === "priority") return ["high", "medium", "low"].indexOf(a.priority) - ["high", "medium", "low"].indexOf(b.priority);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, search, status, priority, sort]);

  return (
    <>
      <section className="page-intro">
        <div>
          <span className="eyebrow">THE FULL PICTURE</span>
          <h1>My Tasks</h1>
          <p className="muted">Keep all the moving pieces in one place.</p>
        </div>
        <button className="button button-primary" onClick={() => openTask()}>
          <span>＋</span>
          Add Task
        </button>
      </section>

      {error && <div className="error-banner" role="alert"><span>!</span><div><strong>We couldn&apos;t load your workspace.</strong><p>{error}</p></div></div>}

      <section className="task-tools">
        <label className="search-box">
          <span>⌕</span>
          <input aria-label="Search tasks" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." />
        </label>

        <label className="select-filter">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label className="select-filter">
          <span>Priority</span>
          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="select-filter sort-filter">
          <span>Sort By</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="due">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </label>
      </section>

      <div className="results-line">
        <span>{loading ? "Loading tasks..." : `${visibleTasks.length} ${visibleTasks.length === 1 ? "task" : "tasks"}`}</span>
        {(search || status !== "all" || priority !== "all") && (
          <button className="text-link" onClick={() => { setSearch(""); setStatus("all"); setPriority("all"); }}>
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="task-list">
          {[0, 1, 2, 3].map((item) => <div className="skeleton-row" key={item} />)}
        </div>
      ) : visibleTasks.length ? (
        <div className="task-list">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              editable
              onEdit={() => openTask(task)}
              onDelete={() => deleteTask(task)}
              onStatus={(value) => changeStatus(task, value)}
            />
          ))}
        </div>
      ) : tasks.length ? (
        <div className="no-results">
          <span>⌕</span>
          <h2>No matching tasks</h2>
          <p>Try a different search or adjust your filters.</p>
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-symbol">＋</span>
          <h2>No tasks yet</h2>
          <p>Create your first task and start getting things done.</p>
          <button className="button button-primary" onClick={() => openTask()}><span>＋</span> Create Task</button>
        </div>
      )}
    </>
  );
}
