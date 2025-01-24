import { useState } from "react";
import PropTypes from "prop-types";
import "../components/styles/ModalAddTask.css";

const CreateAreaModal = ({ onClose, onSave, editArea = null }) => {
  const [formData, setFormData] = useState(
    editArea || {
      nombre_area: "",
      descripcion: "",
      departamento: "",
      status: "active",
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.nombre_area || !formData.departamento) {
        throw new Error("Nombre del área y departamento son requeridos");
      }

      const areaData = {
        ...formData,
        id_area: editArea?.id_area,
      };

      await onSave(areaData);
      onClose();
    } catch (error) {
      console.error("Error en el formulario:", error);
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="backdrop" onClick={onClose}></div>
      <div className="modal-create-task">
        <h2>{editArea ? "Editar Área" : "Crear Nueva Área"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del Área:</label>
            <input
              type="text"
              name="nombre_area"
              value={formData.nombre_area}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Departamento:</label>
            <input
              type="text"
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </div>

          <div className="button-group">
            <button type="submit">
              {editArea ? "Guardar Cambios" : "Crear Área"}
            </button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

CreateAreaModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  editArea: PropTypes.object,
};

export default CreateAreaModal;
