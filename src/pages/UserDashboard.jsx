/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import TaskTable from "../components/tasktable/TaskTable";
import { taskService } from "../services/taskService";
import "./Dashboard.css";
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadTasks();
      toast.success('¡Bienvenido! Interactuas como Usuario');
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const userId = String(user.id);

      console.log("\n=== DEBUG USUARIO ===");
      console.log("1. Usuario actual:", {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      const userTasks = await taskService.getAllTasks(userId, user.role);
      console.log("2. Tareas recibidas:", userTasks);
      console.log("=== FIN DEBUG ===\n");

      setTasks(userTasks);
      setError(null);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
      setError("Error al cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      await loadTasks();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("tu no puedes hacer eso 🚫");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      try {
        await taskService.deleteTask(taskId);
        await loadTasks();
      } catch (error) {
        console.error("Error al eliminar tarea:", error);
        alert("Error al eliminar la tarea");
      }
    }
  };

  if (!user) {
    return <div className="loading">Redirigiendo al login...</div>;
  }

  if (loading) {
    return <div className="loading">Cargando tareas...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>¡ Hola {user.name} !</h1><span style={{ fontStyle: "italic", paddingLeft: "10px", fontSize: "13px" }}>Esta Es Tu Bandeja De Tareas</span>
        </div>
        <div className="user-info" style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "20px" }}>{user.email}</span>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="logout-button"
          >
            <i className="fa-solid fa-right-from-bracket"></i> Cerrar sesión
          </button>
        </div>
      </header>
      <main className="dashboard-content">
        <TaskTable
          tasks={tasks}
          onDeleteTask={handleDeleteTask}
          onEditTask={() => { }}
          onStatusChange={handleStatusChange}
        />
      </main>
    </div>
  );
};

export default UserDashboard;
