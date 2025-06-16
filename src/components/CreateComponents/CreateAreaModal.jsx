import { useState } from "react";
import PropTypes from "prop-types";
import "./styles/ModalAddTask.css";
import { motion } from "framer-motion"

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
      if (!formData.nombre_area) {
        throw new Error("El nombre del área es requerido");
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
      <div className="backdrop" >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="modal-create-task"
          style={{ width: "fit-content", height: "fit-content" }}>
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



            <div className="button-group">
              <motion.button
                initial={{ opacity: 0, scale: .8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                type="submit">
                {editArea ? "Guardar Cambios" : "Crear Área"}
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

CreateAreaModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  editArea: PropTypes.object,
};

export default CreateAreaModal;
