import { useEffect, useState } from "react";
import "../components/styles/BoxTask2.css";

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:6005/tasks");
        if (!response.ok) {
          throw new Error("Error al obtener las tareas");
        }
        const data = await response.json();
        console.log("Datos recibidos:", data);
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="boxTask2">
      <table className="task-table">
        <thead>
          <tr>
            <th>Tarea</th>
            <th>Descripción</th>
            <th>Usuario</th>
            <th>Fecha Límite</th>
            <th>Área</th>
            <th>Empresa</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">Cargando tareas...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="6" style={{ color: "red" }}>
                Error: {error}
              </td>
            </tr>
          ) : tasks.length === 0 ? (
            <tr>
              <td colSpan="6">No hay tareas asignadas</td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.descripcion}</td>
                <td>{task.user}</td>
                <td>{task.fecha_limite}</td>
                <td>{task.proyecto || "Área no asignada"}</td>
                <td>{task.empresa || "Empresa no asignada"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
