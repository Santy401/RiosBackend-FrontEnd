/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import TaskTable from "../components/tasktable/TaskTable";
import CompanyList from "../components/ListsComponents/CompanyList";
import { taskService } from "../services/taskService";
import { toast } from 'react-toastify';
import "./Dashboard.css";
import "./UserDashboard.css";
import { LayoutGrid, Building2 } from 'lucide-react';

const UserDashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ['tareas', 'empresas'];
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadTasks();
      toast.success('¡Bienvenido! Usuario', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light',
      });
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
    return <div className="error">{error} <button onClick={() => navigate("/login")}>Inicia Sesión de nuevo</button></div>;
  }

  return (
    <div className="user-dashboard">
      <header className="dashboard-header-user">
        <div>
          <h1>¡ Hola {user.name} !</h1>
        </div>
        <div className="user-info">
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
      <main className="dashboard-content-user">
        <div 
          className="slider-container"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* Slide de Tareas */}
          <div className="slide slide-left">
            <div className="panel-container">
              <h2 className="section-title">
                <LayoutGrid size={24} />
                Mis Tareas
              </h2>
              <div className="task-table-container">
                <TaskTable
                  tasks={tasks}
                  onDeleteTask={handleDeleteTask}
                  onEditTask={() => {}}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </div>
          </div>

          {/* Slide de Empresas */}
          <div className="slide slide-right">
            <div className="panel-container">
              <h2 className="section-title">
                <Building2 size={24} />
                Empresas
              </h2>
              <div className="company-table-container">
                <CompanyList readOnly={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <div className="navigation-buttons">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`nav-button ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir a ${slides[index]}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
