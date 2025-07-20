import { useState } from "react";
import PropTypes from "prop-types";
import "./styles/ModalAddTask.css";
import { companyService } from "../../services/companyService";
import { motion } from "framer-motion";

const CreateCompanyModal = ({ onClose, onSave, editCompany = null, loadCompanies }) => {
  const [formData, setFormData] = useState(
    editCompany || {
      name: "",
      nit: "",
      email: "",
      cellphone: "",
      dian: "",
      legalSignature: "",
      accountingSoftware: "",
      user: "",
      password: "",
      mailServer: "",
      companyType: "",
      status: "active",
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.name || !formData.nit || !formData.email) {
        throw new Error("Nombre, NIT y Email son campos obligatorios");
      }

      const companyData = {
        ...formData,
        id: editCompany?.id,
        status: formData.status || "active",
        companyType: formData.companyType || "A",
      };

      let savedCompany;

      if (editCompany) {
        savedCompany = await companyService.updateCompany(editCompany.id, companyData);
      } else {
        savedCompany = await companyService.createCompany(companyData);
      }

      if (!savedCompany || !savedCompany.id) {
        console.error("Respuesta del servidor:", savedCompany);
        throw new Error("Error en la respuesta del servidor");
      }

      await loadCompanies();
      onSave(savedCompany);
      onClose();

    } catch (error) {
      console.error("Error detallado:", error);
      setError(error.message || "Error al procesar la operación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: value,
      };
      console.log("🟢 Estado actualizado:", updatedFormData);
      return updatedFormData;
    });
  };


  return (
    <>
      <div className="backdrop">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="modal-create-task">
          <h2>{editCompany ? "Editar Empresa" : "Crear Nueva Empresa"}</h2>

          <form onSubmit={handleSave}>
            {isLoading ? (
              <p className="loaling">Cargando...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <>
                <div className="form-group">
                  <label>Nombre de la Empresa: *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>NIT: *</label>
                  <input
                    type="text"
                    name="nit"
                    value={formData.nit}
                    onChange={handleChange}
                  />
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
                </div>

                <div className="form-group">
                  <label>Celular:</label>
                  <input
                    type="text"
                    name="cellphone"
                    value={formData.cellphone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Clave DIAN:</label>
                  <input
                    type="text"
                    name="dian"
                    value={formData.dian}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Firma Legal:</label>
                  <input
                    type="text"
                    name="legalSignature"
                    value={formData.legalSignature}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Software Contable:</label>
                  <input
                    type="text"
                    name="accountingSoftware"
                    value={formData.accountingSoftware}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Usuario:</label>
                  <input
                    type="text"
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Clave Del Correo:</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Servidor de Correo:</label>
                  <input
                    type="text"
                    name="mailServer"
                    value={formData.mailServer}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Tipo de Empresa:</label>
                  <select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    required
                    className="select-field"
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="A">Tipo A</option>
                    <option value="B">Tipo B</option>
                    <option value="C">Tipo C</option>
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
                    {editCompany ? "Guardar Cambios" : "Crear Empresa"}
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
              </>
            )}
          </form>
        </motion.div>
      </div>
    </>
  );
};
CreateCompanyModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  editCompany: PropTypes.object,
  loadCompanies: PropTypes.func.isRequired,
};



export default CreateCompanyModal;
