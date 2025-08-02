import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { userService } from "../../services/userService";
import CreateUser from "../CreateComponents/createUser";
import ConfirmModal from "../common/ConfirmModal";
import { showToast } from "../common/ToastNotification";
import "./styles/userList.css";
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


  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      // Asegurar que data sea un array
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("Error al cargar usuarios");
      setUsers([]); // Establecer array vacío en caso de error
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
      showToast("Usuario eliminado exitosamente", "success");
    } catch (err) {
      showToast(err.message || "Error al eliminar el usuario", "error");
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
      showToast("Usuario creado exitosamente", "success");
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      showToast("Error al guardar usuario", "error");
    }
  };

  const filteredUsers = (Array.isArray(users) ? users : []).filter((user) => {
    const searchText = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.role?.toLowerCase().includes(searchText)
    );
  });

  if (loading) return <motion.div
    className="loadingArea"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
  </motion.div>;
  if (error) return <div className="no-users">{error}</div>;

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <div className="header-top">
          <motion.button
            initial={{ opacity: 0, scale: .8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.8 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
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
                {user.email !== 'erios@riosbackend.com' && (
                  <div className="user-actions">
                    <motion.button
                      initial={{ opacity: 0, scale: .8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
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
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      onClick={() => handleDeleteClick(user)}
                      className="delete-button"
                      title="Eliminar usuario"
                    >
                      <i className="fas fa-trash"></i>
                    </motion.button>
                  </div>
                )}
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

    </div>
  );
};

export default UserList;
