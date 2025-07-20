import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Styles/TaskDetailModa.css";
import { userService } from "../services/userService.js";
import { companyService } from "../services/companyService.js";
import { areaService } from "../services/areaService.js";

const TaskDetailModal = ({ task, onClose }) => {
  const [, setUserData] = useState(null);
  const [, setCompanyData] = useState(null);
  const [, setAreaData] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    // Sumar 1 día
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (task.assigned_to) {
          const users = await userService.getAllUsers();
          const user = users.find(
            (u) => String(u.id) === String(task.assigned_to)
          );
          console.log("Task assigned_to:", task.assigned_to);
          console.log("Found User:", user);
          setUserData(user);
        }
        if (task.company) {
          const companies = await companyService.getAllCompanies();
          const company = companies.find(
            (c) => String(c.id) === String(task.company)
          );
          setCompanyData(company);
        }
        if (task.area) {
          const areas = await areaService.getAllAreas();
          const area = areas.find((a) => String(a.id) === String(task.area));
          setAreaData(area);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, [task]);

  return (
    <>
      <div className="backdrop" onClick={onClose}></div>
      <div className="detail-modal">
        <div className="detail-modal-header">
          <h2>Detalles de la Tarea</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <div className="detail-modal-content">
          <div className="detail-group">
            <label>Título:</label>
            <p>{task.title}</p>
          </div>



          <div className="detail-group">
            <label>Asignado a:</label>
            <p>{task.assignedUser?.name || "No asignado"}</p>
          </div>

          <div className="detail-group">
            <label>Empresa:</label>
            <p>{task.company?.name || "No especificada"}</p>
          </div>

          <div className="detail-group">
            <label>Área:</label>
            <p>{task.area?.nombre_area || "No especificada"}</p>
          </div>

          <div className="detail-group">
            <label>Estado:</label>
            <span className={`status-in-progress ${task.status || "status-completed"}`} style={{
              maxWidth: "100px",
              textAlign: "center",
              ...(task.status === "completed" && {
                backgroundColor: "#00ca301f",
                color: "#00ff3a",
                border: "1px solid green"
              })
            }}>
              {task.status === "pending"
                ? "Pendiente"
                : task.status === "in-progress"
                  ? "En Proceso"
                  : task.status === "completed"
                    ? "Completada"
                    : "En Proceso"}
            </span>
          </div>

          <div className="detail-group">
            <label>creado el</label>
            <p style={{ marginleft: "12px" }}>{formatDate(task.createdAt)}</p>
          </div>

          <div className="detail-group">
            <label>Fecha Limite</label>
            <p>{formatDate(task.due_date)}</p>
          </div>

          <div className="detail-group" style={{ display: "flex", flexDirection: "column" }}>
            <label>Descripción:</label>
            <div className="descripcion-tarea"><p style={{ width: "100%", position: " relative", letterSpacing: " 0.1px", lineHeight: " 25px", textAlign: "justify" }}>{task.observation || "Sin descripción"}</p></div>
          </div>
        </div>
      </div>
    </>
  );
};

TaskDetailModal.propTypes = {
  task: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TaskDetailModal;
