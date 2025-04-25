import { useState } from "react";
import PropTypes from "prop-types";
import "../components/styles/ModalAddTask.css";
import { useAuth } from "../context/authContext";
import { motion } from "framer-motion";

const CreateUser = ({ onClose, onSave, editUser = null }) => {
  const [formData, setFormData] = useState(
    editUser || {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    }
  );
  const [errors, setErrors] = useState({});
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!editUser) {
      if (!formData.password) {
        newErrors.password = "La contraseña es requerida";
      } else if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <>
      <div className="backdrop">
        <motion.div
          className="modal-create-task"
          initial={{ opacity: 0, scale: 0.9 }}
          exit={{ opacity: 0, scale: .9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <h2>{editUser ? "Editar Usuario" : "Crear Nuevo Usuario"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre: *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label>Email: *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {!editUser && (
              <>
                <div className="form-group">
                  <label>Contraseña: *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirmar Contraseña: *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              </>
            )}

            <div className="form-group">
              <label>Rol:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="button-group">
              <motion.button
                initial={{ opacity: 0, scale: .8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                type="submit">
                {editUser ? "Guardar Cambios" : "Crear Usuario"}
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

CreateUser.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  editUser: PropTypes.object,
};

export default CreateUser;
