import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { companyService } from "../services/companyService";
import CreateCompanyModal from "./CreateCompanyModal";
import "../components/styles/CompanyList.css";
import ConfirmModal from "./ConfirmModal";
import Notification from "./Notification";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  const [companyTypeFilter, setCompanyTypeFilter] = useState(""); // Filtro por tipo de empresa

  // Cargar empresas desde el backend
  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAllCompanies();
      setCompanies([...data]);
      setCompanies(data);
    } catch (err) {
      console.error("Error al cargar empresas:", err);
      setError(err.message || "Error al cargar las empresas");
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar empresas al iniciar o cuando el usuario cambie
  useEffect(() => {
    if (user) {
      loadCompanies();
    }
  }, [user]);

  const handleSaveCompany = async (newCompany) => {
    console.log("📤 Enviando datos:", newCompany);
  
    try {
      await companyService.createCompany(newCompany);
      setNotification({
        message: "Empresa guardada exitosamente",
        type: "success",
      });
      await loadCompanies();
    } catch (err) {
      console.error("🔴 Error en handleSaveCompany:", err.response?.data || err.message);
      setNotification({
        message: err.response?.data?.error || "Error al guardar la empresa",
        type: "error",
      });
    }
  };
  
  
  

  // Manejo de eliminar empresa
  const handleConfirmDelete = async () => {
    try {
      await companyService.deleteCompany(companyToDelete.id);
      setNotification({
        message: "Empresa eliminada exitosamente",
        type: "success",
      });
      await loadCompanies();
    } catch (err) {
      setNotification({
        message: err.message || "Error al eliminar empresa",
        type: "error",
      });
    } finally {
      setShowConfirmModal(false);
      loadCompanies();
      setCompanyToDelete(null);
    }
  };

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setShowConfirmModal(true);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setShowCreateModal(true);
    loadCompanies();
  };

  const handleCardClick = (company) => {
    setSelectedCompany(selectedCompany?.id === company.id ? null : company);
  };

  // Filtro de empresas
  const filteredCompanies = companies.filter((company) => {
    const searchText = searchQuery.toLowerCase();
    const matchesSearchQuery =
      (company?.name && company.name.toLowerCase().includes(searchText)) ||
      (company?.nit && company.nit.toLowerCase().includes(searchText)) ||
      (company?.email && company.email.toLowerCase().includes(searchText));

    const matchesTypeFilter =
      !companyTypeFilter || company.companyType === companyTypeFilter;

    return matchesSearchQuery && matchesTypeFilter;
  });

  const getCompanyTypeText = (type) => {
    const types = {
      A: "Tipo A",
      B: "Tipo B",
      C: "Tipo C",
    };
    return types[type] || "No especificado";
  };

  if (loading) return <div className="loading">Cargando empresas...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="company-list-container">
      <div className="company-list-header">
        <div className="header-top">
          <h2>Lista de Empresas</h2>
          <button
            className="create-button"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fa-solid fa-plus"></i> Crear Empresa
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar empresa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          className="company-type-filter"
          value={companyTypeFilter}
          onChange={(e) => setCompanyTypeFilter(e.target.value)}
        >
          <option>Filtrar por tipo </option>
          <option value="A">Tipo A</option>
          <option value="B">Tipo B</option>
          <option value="C">Tipo C</option>
        </select>
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="no-companies">No se encontraron empresas</div>
      ) : (
        <div className="companies-grid">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className={`company-card ${
                selectedCompany?.id === company.id ? "expanded" : ""
              }`}
              onClick={() => handleCardClick(company)}
            >
              <div className="company-card-header">
                <h3>{company.name}</h3>
                <div
                  className="company-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleEditCompany(company)}
                    className="edit-button"
                    title="Editar empresa"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(company)}
                    className="delete-button"
                    title="Eliminar empresa"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="company-card-content">
                <p className="company-nit">
                  <i className="fa-solid fa-id-card"></i>
                  {company.nit}
                </p>
                <p className="company-email">
                  <i className="fa-solid fa-envelope"></i>
                  {company.email || "Sin correo"}
                </p>
                <p className="company-type" data-type={company.companyType}>
                  <i className="fa-solid fa-building"></i>
                  {getCompanyTypeText(company.companyType)}
                </p>

                {selectedCompany?.id === company.id && (
                  <div className="company-expanded-details">
                    <p className="company-phone">
                      <i className="fa-solid fa-phone"></i>
                      {company.cellphone || "No especificado"}
                    </p>
                    <p className="company-dian">
                      <i className="fa-solid fa-file-invoice"></i>
                      {company.dian || "No especificado"}
                    </p>
                    <p className="company-signature">
                      <i className="fa-solid fa-signature"></i>
                      {company.legalSignature || "No especificado"}
                    </p>
                    <p className="company-software">
                      <i className="fa-solid fa-calculator"></i>
                      {company.accountingSoftware || "No especificado"}
                    </p>
                    <p className="company-user">
                      <i className="fa-solid fa-user"></i>
                      {company.user || "No especificado"}
                    </p>
                    <p className="company-server">
                      <i className="fa-solid fa-server"></i>
                      {company.mailServer || "No especificado"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateCompanyModal
          onClose={() => {
            setShowCreateModal(false);
            setEditingCompany(null);
          }
        }
          onSave={handleSaveCompany}
          editCompany={editingCompany}
          loadCompanies={loadCompanies}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          message={`¿Estás seguro de que quieres eliminar la empresa ${companyToDelete.name}?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default CompanyList;
