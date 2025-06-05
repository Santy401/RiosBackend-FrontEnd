import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { clientService } from "../services/clientService";
import CreateClientModal from "./CreateClientModal";
import ConfirmModal from "./ConfirmModal";
import { showToast } from "./ToastNotification";
import "./styles/ClientList.css";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const [selectedClient, setSelectedClient] = useState(null);
  const [filterType, setFilterType] = useState("");
  useEffect(() => {
    if (user) {
      loadClients();
    }
  }, [user]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAllClients();
      setClients(data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      setError("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (client) => {
    setSelectedClient(selectedClient?.id === client.id ? null : client);
  };

  const handleEditClick = (e, client) => {
    e.stopPropagation();
    setEditingClient(client);
    setShowCreateModal(true);
  };

  const handleDeleteClick = (e, client) => {
    e.stopPropagation();
    setClientToDelete(client);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await clientService.deleteClient(clientToDelete.id);
      setClients((prevClients) =>
        prevClients.filter((c) => c.id !== clientToDelete.id)
      );
      showToast("Cliente eliminado exitosamente", "success");
    } catch (err) {
      showToast(err.message || "Error al eliminar el cliente", "error");
    } finally {
      setShowConfirmModal(false);
      setClientToDelete(null);
    }
  };

  const handleSaveClient = async (clientData) => {
    try {
      let updatedClient;
      if (editingClient) {
        updatedClient = await clientService.updateClient(
          editingClient.id,
          clientData
        );
        setClients((prevClients) =>
          prevClients.map((client) =>
            client.id === editingClient.id ? updatedClient : client
          )
        );
      } else {
        const newClient = await clientService.createClient(clientData);
        setClients((prevClients) => [...prevClients, newClient]);
      }

      setShowCreateModal(false);
      setEditingClient(null);
      showToast(`Cliente ${editingClient ? "actualizado" : "creado"} exitosamente`, "success");
    } catch (err) {
      console.error("Error al guardar cliente:", err);
      setNotification({
        message: err.message || "Error al guardar el cliente",
        type: "error",
      });
    }
  };

  if (loading) return <div className="loading">Cargando clientes...</div>;
  if (error) return <div className="error">{error}</div>;

  const filteredClients = clients.filter(
    (client) =>
      (client?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (client?.nit || "").includes(searchQuery)
  );

  const filteredByType = filterType
    ? filteredClients.filter((client) => client.tipoEmpresa === filterType)
    : filteredClients;

  const renderCell = (value = "") => {
    return <td>{value || "N/A"}</td>;
  };

  return (
    <div className="client-list-container">
      <div className="client-list-header">
        <div className="header-top">
          <h2>Lista de Clientes</h2>
          <div className="align-bt-clients">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="">Seleciona tipo de empresa </option>
              <option value="A">Tipo A</option>
              <option value="B">Tipo B</option>
              <option value="C">Tipo C</option>
            </select>
            <button
              className="create-button"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="fa-solid fa-plus"></i> Nuevo Cliente
            </button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredByType.length === 0 ? (
        <div
          className="no-data-message"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "20px",
            alignItems: "center",
          }}
        >
          <i
            className="fas fa-users"
            style={{ marginRight: "10px", fontSize: "20px", color: "#6c757d" }}
          ></i>
          <span>No hay clientes registrados</span>
        </div>
      ) : (
        <div className="client-table-container">
          <table className="client-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>NIT</th>
                <th>Cédula</th>
                <th>Clave DIAN</th>
                <th>Firma Electrónica</th>
                <th>Software Contable</th>
                <th>Usuario</th>
                <th>Clave</th>
                <th>Servidor de correo</th>
                <th>Correo</th>
                <th>Clave CC</th>
                <th>Clave SS</th>
                <th>Clave Mas</th>
                <th>Tipo de empresa</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredByType.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => handleRowClick(client)}
                  className={selectedClient?.id === client.id ? "selected" : ""}
                >
                  {renderCell(client.name)}
                  {renderCell(client.nit)}
                  {renderCell(client.cedula)}
                  {renderCell(client.dianKey)}
                  {renderCell(client.electronicSignature)}
                  {renderCell(client.accountingSoftware)}
                  {renderCell(client.username)}
                  {renderCell(client.password || "••••••••")}
                  {renderCell(client.emailServer)}
                  {renderCell(client.claveUser)}
                  {renderCell(client.claveCC)}
                  {renderCell(client.claveSS)}
                  {renderCell(client.claveMas)}
                  {renderCell(client.tipoEmpresa)}
                  <td>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={(e) => handleEditClick(e, client)}
                        className="edit-button"
                        title="Editar cliente"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, client)}
                        className="delete-button"
                        title="Eliminar cliente"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <CreateClientModal
          onClose={() => {
            setShowCreateModal(false);
            setEditingClient(null);
          }}
          onSave={handleSaveClient}
          editClient={editingClient}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          message={`¿Estás seguro de que quieres eliminar al cliente ${clientToDelete.name}?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowConfirmModal(false);
            setClientToDelete(null);
          }}
        />
      )}


    </div>
  );
};

export default ClientList;
