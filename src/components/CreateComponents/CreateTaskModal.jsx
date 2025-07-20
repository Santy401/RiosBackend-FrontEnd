import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { userService } from "../../services/userService";
import { companyService } from "../../services/companyService";
import { areaService } from "../../services/areaService";
import "./styles/ModalAddTask.css";
import { motion } from "framer-motion";

const CreateTaskModal = ({ onClose, onSave, editTask = null }) => {
  const [formData, setFormData] = useState(
    editTask || {
      title: "",
      observation: "",
      assigned_to: "",
      company_id: "",
      area_id: "",
      due_date: "",
      status: "in_progress",
      createdAt: new Date().toISOString(),
    }
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);


  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setLoading(true);
        const [usersData, companiesData, areasData] = await Promise.all([
          userService.getAllUsers(),
          companyService.getAllCompanies(),
          areaService.getAllAreas(),
        ]);

        setUsers(usersData);
        setCompanies(companiesData);
        setAreas(areasData);
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar los datos necesarios");
      } finally {
        setLoading(false);
      }
    };

    loadFormData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que la fecha exista
    if (!formData.due_date) {
      alert("Por favor seleccione una fecha límite");
      return;
    }
  
    // No necesitas el payload separado, usa directamente formData
    try {
      const response = await onSave(formData);
      console.log("Respuesta del servidor:", response);
      if (response && response.task) {
        console.log("Tarea creada/actualizada:", response.task);
        setFormData(response.task);
      }
      onClose();
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
      alert("Ocurrió un error al procesar la solicitud.");
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'due_date') {
      // Mantén solo la fecha sin hora
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="backdrop">
          <motion.div
            className="modal-create-task"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <h2>{editTask ? "Editar Tarea" : "Crear Nueva Tarea"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Título: *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Asignar a: *</label>
                <select
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar usuario</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Empresa: *</label>
                <select
                  name="company_id"
                  value={formData.company_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar empresa</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name} - Tipo {company.companyType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Área: *</label>
                <select
                  name="area_id"
                  value={formData.area_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar área</option>
                  {areas.map((area) => (
                    <option key={area.id_area} value={area.id_area}>
                      {area.nombre_area} - {area.departamento}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
              <label>Fecha límite: *</label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  name="observation"
                  value={formData.observation}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="button-group">
                <motion.button
                  initial={{ opacity: 0, scale: .8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
                  whileTap={{ scale: 0.8 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  type="submit">
                  {editTask ? "Guardar Cambios" : "Crear Tarea"}
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, scale: .8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
                  whileTap={{ scale: 0.8 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  type="button" onClick={onClose}>
                  Cancelar
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
    </>
  );
};

CreateTaskModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  editTask: PropTypes.object,
};

export default CreateTaskModal;
