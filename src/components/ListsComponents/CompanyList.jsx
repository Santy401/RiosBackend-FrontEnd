import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { companyService } from "../../services/companyService";
import CreateCompanyModal from "../CreateComponents/CreateCompanyModal";
import "./styles/CompanyTable.css";
import ConfirmModal from "../common/ConfirmModal";
import { showToast } from "../common/ToastNotification";
import DontCompany from "../../assets/svg/DontCompany.svg";
import { motion } from "framer-motion";
import { Listbox } from '@headlessui/react';
import { Info } from 'lucide-react';

const CompanyList = ({ readOnly = false }) => {
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
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const [companyTypeFilter, setCompanyTypeFilter] = useState("");

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAllCompanies();
      setCompanies(data);
    } catch (err) {
      console.error("Error al cargar empresas:", err);
      setError(err.message || "Error al cargar las empresas");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (companyId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }));
  };

  useEffect(() => {
    if (user) {
      loadCompanies();
    }
  }, [user]);

  const handleSaveCompany = async (companyData) => {
    try {
      setLoading(true);

      if (editingCompany) {
        await companyService.updateCompany(editingCompany.id, companyData);
        showToast("Empresa actualizada exitosamente", "success");
      } else {
        const createdCompany = await companyService.createCompany(companyData);
        if (!createdCompany) {
          throw new Error("La empresa no fue creada correctamente");
        }
        showToast("Empresa creada exitosamente", "success");
      }

      setShowCreateModal(false);
      setEditingCompany(null);
      await loadCompanies();
    } catch (err) {
      console.error("Error al guardar empresa:", err);
      showToast(err.message || "Error al guardar la empresa", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      const companies = await companyService.getAllCompanies();
      console.log("🧾 Empresas recibidas:", companies);
      setCompanies(companies);
    };

    fetchCompanies();
  }, []);

  const handleEditCompany = async (updatedCompany) => {
    try {
      setEditingCompany(updatedCompany);
      setShowCreateModal(true);
    } catch (err) {
      console.error("Error al preparar edición:", err);
      showToast("Error al preparar la edición", "error");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await companyService.deleteCompany(companyToDelete.id);
      showToast("Empresa eliminada exitosamente", "success");
      await loadCompanies();
    } catch (err) {
      showToast(err.message || "Error al eliminar la empresa", "error");
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

  const handleCardClick = (company) => {
    setSelectedCompany(selectedCompany?.id === company.id ? null : company);
  };

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

  if (loading) return <div
    className="loader loaderCompanies">
  </div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="company-list-container">
        {!readOnly && (
          <div className="company-list-header">
            <div className="header-top">
              <motion.button
                initial={{ opacity: 0, scale: .8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.8 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="create-button"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="fa-solid fa-plus"></i> Crear Empresa
              </motion.button>
            </div>
            <input
              type="text"
              placeholder="Buscar empresa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div className="header-Listbox">
              <Listbox value={companyTypeFilter} onChange={setCompanyTypeFilter}>
                <Listbox.Button className="company-type-filter">
                  {companyTypeFilter || 'Filtrar por tipo'}
                </Listbox.Button>
                <Listbox.Options className="listbox-options-company">
                  <Listbox.Option value="" className="listbox-option-company">
                    Filtrar por tipo
                  </Listbox.Option>
                  <Listbox.Option value="A" className="listbox-option-company">
                    Tipo A
                  </Listbox.Option>
                  <Listbox.Option value="B" className="listbox-option-company">
                    Tipo B
                  </Listbox.Option>
                  <Listbox.Option value="C" className="listbox-option-company">
                    Tipo C
                  </Listbox.Option>
                </Listbox.Options>
              </Listbox>
            </div>
          </div>
        )}

        {filteredCompanies.length === 0 ? (
          <div className="no-companies">
            <img src={DontCompany} alt="No se encontraron empresas" />
          </div>
        ) : (
          <div style={{ overflowX: "auto", width: "100%" }} className="task-list-container">
            <table className="task-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>NIT</th>
                  <th>Clave del Correo</th>
                  <th>Tipo</th>
                  <th>Correo</th>
                  <th>Usuario</th>
                  <th>Clave Dian</th>
                  <th>NIT</th>
                  <th>Software</th>
                  <th>Firma Electrónica</th>
                  <th>Servidor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id}>
                    <td className="company-name">{company.name}</td>
                    <td>{company.nit}</td>
                    <td>
                      <button
                        className="show-password-button"
                        onClick={() => togglePasswordVisibility(company.id)}
                        title={visiblePasswords[company.id] ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {visiblePasswords[company.id] ?
                          company.password || "Sin contraseña" :
                          "•••••••••••••••••"
                        }
                      </button>
                    </td>
                    <td className="company-type">{getCompanyTypeText(company.companyType)}</td>
                    <td>{company.email || "Sin correo"}</td>
                    <td>{company.user || "No especificado"}</td>
                    <td>{company.dian || "No especificado"}</td>
                    <td>{company.nit || "No especificado"}</td>
                    <td>{company.accountingSoftware || "No especificado"}</td>
                    <td>{company.legalSignature || "No especificado"}</td>
                    <td>{company.mailServer || "No especificado"}</td>
                    <td className="action-buttons">
                      {!readOnly && (
                        <div>
                          <button
                            className="action-button edit-button"
                            onClick={() => handleEditCompany(company)}
                            title="Editar empresa"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button
                            className="action-button delete-button"
                            onClick={() => handleDeleteClick(company)}
                            title="Eliminar empresa"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateCompanyModal
          onClose={() => {
            setShowCreateModal(false);
            setEditingCompany(null);
          }}
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
    </>
  );
};

export default CompanyList;
