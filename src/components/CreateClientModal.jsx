import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles/CreateClientModal.css";

const CreateClientModal = ({ onClose, onSave, editClient }) => {
  const [formData, setFormData] = useState({
    name: "",
    nit: "",
    cedula: "",
    dianKey: "",
    electronicSignature: "",
    accountingSoftware: "",
    username: "",
    password: "",
    emailServer: "",
    emailServerUser: "",
    claveUser: "",
    claveCC: "",
    claveSS: "",
    claveMas: "",
    tipoEmpresa: "",
  });

  useEffect(() => {
    if (editClient) {
      setFormData({
        name: editClient.name || "",
        nit: editClient.nit || "",
        cedula: editClient.cedula || "",
        dianKey: editClient.dianKey || "",
        electronicSignature: editClient.electronicSignature || "",
        accountingSoftware: editClient.accountingSoftware || "",
        username: editClient.username || "",
        password: editClient.password || "",
        emailServer: editClient.emailServer || "",
        emailServerUser: editClient.emailServerUser || "",
        claveUser: editClient.claveUser || "",
        claveCC: editClient.claveCC || "",
        claveSS: editClient.claveSS || "",
        claveMas: editClient.claveMas || "",
        tipoEmpresa: editClient.tipoEmpresa || "",
      });
    }
  }, [editClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editClient ? "Editar Cliente" : "Crear Nuevo Cliente"}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="required-field">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="nit" className="required-field">
                  NIT
                </label>
                <input
                  type="text"
                  id="nit"
                  name="nit"
                  value={formData.nit}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cedula" className="required-field">
                  Cédula
                </label>
                <input
                  type="text"
                  id="cedula"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dianKey">Clave DIAN</label>
                <input
                  type="text"
                  id="dianKey"
                  name="dianKey"
                  value={formData.dianKey}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="electronicSignature">Firma Electrónica</label>
                <input
                  type="text"
                  id="electronicSignature"
                  name="electronicSignature"
                  value={formData.electronicSignature}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="accountingSoftware">Software Contable</label>
                <input
                  type="text"
                  id="accountingSoftware"
                  name="accountingSoftware"
                  value={formData.accountingSoftware}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Usuario</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Clave</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={editClient ? "••••••••" : ""}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="emailServer">Servidor de correo</label>
              <input
                type="text"
                id="emailServer"
                name="emailServer"
                value={formData.emailServer}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="emailServerUser">correo Usuario</label>
              <input
                type="text"
                id="emailServerUser"
                name="emailServerUser"
                value={formData.emailServerUser}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="claveUser">Clave del usuario</label>
              <input
                type="text"
                id="claveUser"
                name="claveUser"
                value={formData.claveUser}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="claveCC">Clave CC</label>
              <input
                type="text"
                id="claveCC"
                name="claveCC"
                value={formData.claveCC}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="claveSS">Clave SS</label>
              <input
                type="text"
                id="claveSS"
                name="claveSS"
                value={formData.claveSS}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="claveMas">Clave Mas</label>
              <input
                type="text"
                id="claveMas"
                name="claveMas"
                value={formData.claveMas}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tipoEmpresa">Tipo de empresa</label>
              <select
                id="tipoEmpresa"
                name="tipoEmpresa"
                value={formData.tipoEmpresa}
                onChange={handleChange}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>  
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-button">
              {editClient ? "Guardar Cambios" : "Crear Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CreateClientModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  editClient: PropTypes.object,
};

export default CreateClientModal;
