import { useState, useEffect } from "react";
import { userService } from "../services/userService.js";

// eslint-disable-next-line react/prop-types
const TaskForm = ({ onSubmit }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    descripcion: "",
    assigned_to: "",
    company: "",
    time: "",
    status: "in_progress",
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersList = await userService.getAllUsers();
        setUsers(usersList.filter((user) => user.role === "user"));
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };
    loadUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enviando datos de tarea:", formData);
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Título:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Descripción:</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Asignar a:</label>
        <select
          name="assigned_to"
          value={formData.assigned_to}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar usuario</option>
          {users.map((user) => (
            <option key={user.id} value={String(user.id)}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Tiempo estimado (horas):</label>
        <input
          type="number"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Crear Tarea</button>
    </form>
  );
};

export default TaskForm;
