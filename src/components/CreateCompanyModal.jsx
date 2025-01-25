import { useState } from "react";
import PropTypes from "prop-types";
import "../components/styles/ModalAddTask.css";
import { companyService } from "../services/companyService";

const CreateCompanyModal = ({ onClose, onSave, editCompany = null, loadCompaies }) => {
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
      companyType: "mediana",
      status: "active",
    }
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!formData.name || !formData.nit || !formData.email) {
      alert("Por favor, completa todos los campos obligatorios.");
      setIsLoading(false);
      return;
    }
  
    const companyData = {
      ...formData,
      id: editCompany?.id,
      status: formData.status || "active",
      companyType: formData.companyType || "mediana",
    };
    
    CreateCompanyModal.propTypes = {
      onClose: PropTypes.func.isRequired,
      onSave: PropTypes.func.isRequired,
      editCompany: PropTypes.object,
      loadCompaies: PropTypes.func.isRequired,
    };
  
    try {
      if (editCompany) {
        await companyService.updateCompany(editCompany.id, companyData);
      } else {
        const response = await companyService.createCompany(companyData);
        if (!response || !response.id) {
          throw new Error("La empresa no fue creada correctamente.");
        }
      }
    
      onSave();
      loadCompaies(); // Actualiza la lista de empresas
      onClose();
    } catch (error) {
      console.error("Error al guardar empresa:", error);
      onClose();
    } finally {
      setIsLoading(false); // Aquí debería ser false
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
        <h2>{editCompany ? "Editar Empresa" : "Crear Nueva Empresa"}</h2>

        <form onSubmit={handleSave}>
          {isLoading ? (
            <p className="loaling">Cargando...</p>
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
                <label>DIAN:</label>
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
                <label>Clave:</label>
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
                  <option value="" disabled>Seleccione un tipo</option>
                  <option value="A">Tipo A</option>
                  <option value="B">Tipo B</option>
                  <option value="C">Tipo C</option>
                </select>
              </div>

              <div className="button-group">
                <button type="submit">
                  {editCompany ? "Guardar Cambios" : "Crear Empresa"}
                </button>
                <button type="button" onClick={onClose}>
                  Cancelar
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
};

CreateCompanyModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  editCompany: PropTypes.object,
};

export default CreateCompanyModal;
