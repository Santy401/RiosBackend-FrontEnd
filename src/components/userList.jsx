import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { userService } from "../services/userService";
import CreateUser from "./createUser";
import ConfirmModal from "./ConfirmModal";
import Notification from "./Notification";
import "../components/styles/userList.css";
import { AnimatePresence, motion } from "framer-motion";


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      loadUsers();
    }
  }, [currentUser, editingUser]);


  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await userService.deleteUser(userToDelete.id);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userToDelete.id));
      setNotification({
        message: "Usuario eliminado exitosamente",
        type: "success",
      });
    } catch (err) {
      setNotification({
        message: err.message || "Error al eliminar usuario",
        type: "error",
      });
    } finally {
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowCreateModal(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      if (!currentUser?.role === "admin") {
        throw new Error("No tienes permisos para gestionar usuarios");
      }

      if (userData.id) {
        await userService.updateUser(userData.id, userData);
      } else {
        await userService.createUser(userData);
      }

      await loadUsers();

      setShowCreateModal(false);
      setEditingUser(null);
      setNotification({
        message: `Usuario ${userData.id ? "actualizado" : "creado"} exitosamente`,
        type: "success",
      });
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      setNotification({
        message: err.message || "Error al guardar usuario",
        type: "error",
      });
    }
  };





  const filteredUsers = users.filter((user) => {
    const searchText = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.role?.toLowerCase().includes(searchText)
    );
  });

  if (loading) return <div className="loading">Cargando usuarios...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <div className="header-top">
          <h2>Lista de Usuarios</h2>
          <motion.button
            initial={{ opacity: 0, scale: .8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="create-button"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fas fa-plus"></i> Crear Usuario
          </motion.button>
        </div>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="users-grid">
        <AnimatePresence>
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: index * 0.07 }} // delay progresivo
              className="user-card"
            >
              <div className="user-card-header">
                <h3>{user.name}</h3>
                <div className="user-actions">
                  <motion.button
                    initial={{ opacity: 0, scale: .8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
                    whileTap={{ scale: 0.8 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    onClick={() => handleEditUser(user)}
                    className="edit-button"
                    title="Editar usuario"
                  >
                    <i className="fas fa-pen"></i>
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, scale: .8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
                    whileTap={{ scale: 0.8 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    onClick={() => handleDeleteClick(user)}
                    className="delete-button"
                    title="Eliminar usuario"
                  >
                    <i className="fas fa-trash"></i>
                  </motion.button>
                </div>
              </div>
              <div className="user-card-content">
                <p className="user-email">
                  <i className="fas fa-envelope"></i>
                  {user.email}
                </p>
                <p className="user-role">
                  <i className="fas fa-user-tag"></i>
                  {user.role}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showCreateModal && (
          <CreateUser
            onClose={() => {
              setShowCreateModal(false);
              setEditingUser(null);
            }}
            onSave={handleSaveUser}
            editUser={editingUser}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showConfirmModal && (
          <ConfirmModal
            message={`¿Estás seguro de que quieres eliminar al usuario ${userToDelete.name}?`}
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setShowConfirmModal(false);
              setUserToDelete(null);
            }}
          />
        )}
      </AnimatePresence>
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

export default UserList;
