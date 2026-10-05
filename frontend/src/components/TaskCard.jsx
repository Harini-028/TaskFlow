const readableStatus = (status) => {
  if (!status) return "Pending";
  if (status === "in-progress") return "In progress";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const prettyDate = (date) =>
  date ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date)) : "No due date";

export default function TaskCard({ task, editable = false, onEdit, onDelete, onStatus }) {
  return (
    <article className="task-row">
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
          <span className={`status-label label-${task.status}`}>{readableStatus(task.status)}</span>
          <span>Due {prettyDate(task.dueDate)}</span>
          <span>Created {prettyDate(task.createdAt)}</span>
        </div>
      </div>

      <div className="task-actions">
        {editable && (
          <>
            <select
              className="status-select"
              aria-label={`Change status for ${task.title}`}
              value={task.status}
              onChange={(event) => onStatus?.(event.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
            <button className="icon-button" title="Edit task" onClick={onEdit}>↗</button>
            <button className="icon-button delete-action" title="Delete task" onClick={onDelete}>×</button>
          </>
        )}
      </div>
    </article>
  );
}
