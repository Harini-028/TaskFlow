import { useState } from "react";

const blankTask = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
};

export default function TaskModal({ task, onClose, onSave, saving }) {
  const [form, setForm] = useState(() => task ? {
    title: task.title || "",
    description: task.description || "",
    status: task.status || "pending",
    priority: task.priority || "medium",
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "",
  } : blankTask);
  const [error, setError] = useState("");

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Task title is required");
      return;
    }
    setError("");
    await onSave({ ...form, title: form.title.trim() });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">TASK DETAILS</span>
            <h2 id="task-modal-title">{task ? "Edit task" : "Create a task"}</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}>×</button>
        </div>
        <form onSubmit={submit}>
          <label className="field-label">Task title<input name="title" value={form.title} onChange={updateField} placeholder="What needs to get done?" maxLength="120" autoFocus required /></label>
          <label className="field-label">Description<textarea name="description" value={form.description} onChange={updateField} placeholder="Add a few details..." rows="4" maxLength="1000" /></label>
          <div className="form-grid">
            <label className="field-label">Status<select name="status" value={form.status} onChange={updateField}><option value="pending">Pending</option><option value="in-progress">In progress</option><option value="completed">Completed</option></select></label>
            <label className="field-label">Priority<select name="priority" value={form.priority} onChange={updateField}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
          </div>
          <label className="field-label">Due date<input name="dueDate" type="date" value={form.dueDate} onChange={updateField} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions"><button className="button button-quiet" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving..." : task ? "Save changes" : "Create task"}</button></div>
        </form>
      </section>
    </div>
  );
}