import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../components/styles/TaskDetailModal.css";
import { userService } from "../services/userService.js";
import { companyService } from "../services/companyService.js";
import { areaService } from "../services/areaService.js";

const TaskDetailModal = ({ task, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [areaData, setAreaData] = useState(null);

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
            <label>Descripción:</label>
            <p>{task.descripcion || "Sin descripción"}</p>
          </div>

          <div className="detail-group">
            <label>Asignado a:</label>
            <p>{userData?.name || "No asignado"}</p>
          </div>

          <div className="detail-group">
            <label>Empresa:</label>
            <p>{companyData?.name || "No especificada"}</p>
          </div>

          <div className="detail-group">
            <label>Área:</label>
            <p>{areaData?.name || "No especificada"}</p>
          </div>

          <div className="detail-group">
            <label>Estado:</label>
            <span className={`status-badge ${task.status || "pending"}`}>
              {task.status === "pending"
                ? "Pendiente"
                : task.status === "in-progress"
                ? "En progreso"
                : task.status === "completed"
                ? "Completada"
                : "No iniciada"}
            </span>
          </div>

          <div className="detail-group">
            <label>Tiempo estimado:</label>
            <p>{task.time} horas</p>
          </div>

          <div className="detail-group">
            <label>Fecha de creación:</label>
            <p>{new Date(task.createdDate).toLocaleDateString()}</p>
          </div>

          <div className="detail-group">
            <label>Fecha límite:</label>
            <p>
              {task.deadline
                ? new Date(task.deadline).toLocaleDateString()
                : "No definida"}
            </p>
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
