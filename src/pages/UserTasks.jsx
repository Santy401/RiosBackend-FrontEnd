import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { tasksAPI } from "../services/api";
import "../styles/UserTasks.css";

const UserTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const response = await tasksAPI.fetch();
        setTasks(response.data);
      } catch (err) {
        console.error("Error al cargar tareas:", err);
        setError(err.message || "Error al cargar las tareas");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadTasks();
    }
  }, [user]);

  if (loading) return <div>Cargando tareas...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-tasks-container">
      <h1>Mis Tareas Asignadas</h1>
      <div className="tasks-grid">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>
                <strong>Descripción:</strong> {task.descripcion}
              </p>
              <p>
                <strong>Empresa:</strong> {task.company?.name}
              </p>
              <p>
                <strong>Área:</strong> {task.area?.nombre_area}
              </p>
              <p>
                <strong>Fecha límite:</strong>{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className={`status status-${task.status}`}>
                Estado: {task.status}
              </p>
            </div>
          ))
        ) : (
          <p className="no-tasks">No tienes tareas asignadas</p>
        )}
      </div>
    </div>
  );
};

export default UserTasks;
