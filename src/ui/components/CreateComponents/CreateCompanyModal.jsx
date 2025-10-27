import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles/ModalAddTask.css";
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
      // Nuevos campos agregados
      tipo: "",
      cedula: "",
      firma: "",
      softwareContable: "",
      usuario: "",
      contraseña: "",
      servidorCorreo: "",
      claveCorreo: "",
      claveCC: "",
      claveSS: "",
      claveICA: "",
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
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      console.log('Datos a enviar al backend:', formData);
      const response = await onSave(formData);
      console.log('Respuesta del backend:', response);
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
      setError(error.message || "Error al guardar la empresa");
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
                {/* Información Básica */}
                <div className="form-section">
                  <h3>Información Básica</h3>
                  <div className="form-row">
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
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
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
                      <label>Teléfono:</label>
                      <input
                        type="text"
                        name="cellphone"
                        value={formData.cellphone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Cédula:</label>
                      <input
                        type="text"
                        name="cedula"
                        value={formData.cedula}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Tipo:</label>
                      <input
                        type="text"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Configuración DIAN y Firma */}
                <div className="form-section">
                  <h3>Configuración DIAN y Firma</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Clave DIAN:</label>
                      <input
                        type="password"
                        name="dian"
                        value={formData.dian}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Firma Electrónica:</label>
                      <input
                        type="password"
                        name="firma"
                        value={formData.firma}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Configuración de Software */}
                <div className="form-section">
                  <h3>Configuración de Software</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Software Contable:</label>
                      <input
                        type="text"
                        name="softwareContable"
                        value={formData.softwareContable}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Usuario Software:</label>
                      <input
                        type="text"
                        name="usuario"
                        value={formData.usuario}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Contraseña Software:</label>
                      <input
                        type="password"
                        name="contraseña"
                        value={formData.contraseña}
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
                  </div>
                </div>

                {/* Configuración de Correo */}
                <div className="form-section">
                  <h3>Configuración de Correo</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Servidor de Correo:</label>
                      <input
                        type="text"
                        name="servidorCorreo"
                        value={formData.servidorCorreo}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Clave del Correo:</label>
                      <input
                        type="password"
                        name="claveCorreo"
                        value={formData.claveCorreo}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Claves Adicionales */}
                <div className="form-section">
                  <h3>Claves Adicionales</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Clave CC:</label>
                      <input
                        type="password"
                        name="claveCC"
                        value={formData.claveCC}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Clave SS:</label>
                      <input
                        type="password"
                        name="claveSS"
                        value={formData.claveSS}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Clave ICA:</label>
                      <input
                        type="password"
                        name="claveICA"
                        value={formData.claveICA}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Firma Legal:</label>
                      <input
                        type="password"
                        name="legalSignature"
                        value={formData.legalSignature}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Campos legacy (mantenidos por compatibilidad) */}
                <div style={{ display: 'none' }}>
                  <input type="text" name="accountingSoftware" value={formData.accountingSoftware} readOnly />
                  <input type="text" name="user" value={formData.user} readOnly />
                  <input type="text" name="password" value={formData.password} readOnly />
                  <input type="text" name="mailServer" value={formData.mailServer} readOnly />
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