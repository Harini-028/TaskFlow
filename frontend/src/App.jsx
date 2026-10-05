import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import TaskModal from "./components/TaskModal";
import Toast from "./components/Toast";
import DashboardPage from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/Profile";
import RegisterPage from "./pages/Register";
import SettingsPage from "./pages/Settings";
import TasksPage from "./pages/Tasks";
import api, { getErrorMessage } from "./services/api";

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [toast, setToast] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("taskflow-theme") || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("taskflow-theme", theme);
  }, [theme]);

  const notify = (message) => {
    if (localStorage.getItem("taskflow-notifications") === "off") return;
    setToast(message);
    window.clearTimeout(window.taskFlowToast);
    window.taskFlowToast = window.setTimeout(() => setToast(""), 3200);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    notify("Logout successful");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage user={user} setUser={setUser} notify={notify} />} />
        <Route path="/register" element={<RegisterPage notify={notify} />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<WorkspaceLayout user={user} setUser={setUser} notify={notify} logout={logout} theme={theme} setTheme={setTheme} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<HomeRedirect />} />
      </Routes>

      <Toast message={toast} />
    </BrowserRouter>
  );
}

function HomeRedirect() {
  return <Navigate to={localStorage.getItem("token") ? "/dashboard" : "/login"} replace />;
}

function WorkspaceLayout({ user, setUser, notify, logout, theme, setTheme }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalTask, setModalTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const refreshTasks = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.get("/api/tasks");
      setTasks(data.tasks || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to connect to server"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  const openTask = (task = null) => {
    setModalTask(task);
    setModalOpen(true);
  };

  const saveTask = async (values) => {
    setSaving(true);
    try {
      if (modalTask) {
        await api.put(`/api/tasks/${modalTask._id}`, values);
        notify("Task updated successfully");
      } else {
        await api.post("/api/tasks", values);
        notify("Task created successfully");
      }
      setModalOpen(false);
      setModalTask(null);
      await refreshTasks();
    } catch (requestError) {
      notify(getErrorMessage(requestError, "Could not save this task"));
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async (task) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    try {
      await api.delete(`/api/tasks/${task._id}`);
      setTasks((items) => items.filter((item) => item._id !== task._id));
      notify("Task deleted successfully");
      await refreshTasks();
    } catch (requestError) {
      notify(getErrorMessage(requestError, "Could not delete this task"));
    }
  };

  const changeStatus = async (task, status) => {
    try {
      const { data } = await api.put(`/api/tasks/${task._id}`, { status });
      setTasks((items) => items.map((item) => (item._id === task._id ? data.task : item)));
      notify("Task updated successfully");
    } catch (requestError) {
      notify(getErrorMessage(requestError, "Could not update task"));
    }
  };

  const signOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const title = {
    "/dashboard": "Dashboard",
    "/tasks": "My Tasks",
    "/profile": "Profile",
    "/settings": "Settings",
  }[location.pathname] || "TaskFlow";

  return (
    <div className="workspace">
      <Sidebar user={user} onLogout={signOut} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((open) => !open)} />

      <div className="workspace-main">
        <Navbar title={title} user={user} />
        <main className="page-content">
          <Outlet context={{ user, setUser, tasks, loading, error, notify, refreshTasks, openTask, deleteTask, changeStatus, theme, setTheme }} />
        </main>
      </div>

      {modalOpen && (
        <TaskModal
          key={modalTask?._id || "new-task"}
          task={modalTask}
          saving={saving}
          onClose={() => {
            setModalOpen(false);
            setModalTask(null);
          }}
          onSave={saveTask}
        />
      )}
    </div>
  );
}

export default App;
