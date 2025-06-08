import { useState, useEffect } from "react";
import CreateAreaModal from "../CreateComponents/CreateAreaModal.jsx";
import { areaService } from "../../services/areaService.js";
import "./styles/AreaList.css";
import { useAuth } from "../../context/authContext";
import ConfirmModal from "../common/ConfirmModal.jsx";
import { showToast } from "../common/ToastNotification.jsx";
import { motion, AnimatePresence } from "framer-motion";

const AreaList = () => {
  const [areas, setAreas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadAreas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await areaService.getAllAreas();
      setAreas(data);
    } catch (err) {
      setError("Error al cargar áreas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadAreas();
  }, [user]);

  const handleDeleteClick = (area) => {
    if (!area?.id_area) {
      showToast("No se puede eliminar el área: datos inválidos", "error");
      return;
    }
    setAreaToDelete(area);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await areaService.deleteArea(areaToDelete.id_area);
      setAreas((prev) =>
        prev.filter((a) => a.id_area !== areaToDelete.id_area)
      );
      showToast("Área eliminada exitosamente", "success");
    } catch (err) {
      showToast(err.message || "Error al eliminar el área", "error");
    } finally {
      setIsDeleting(false);
      setShowConfirmModal(false);
      setAreaToDelete(null);
    }
  };

  const handleEditArea = (area) => {
    setEditingArea(area);
    setShowCreateModal(true);
  };

  const handleSaveArea = async (areaData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (!user?.role === "admin") {
        throw new Error("No tienes permisos para gestionar áreas");
      }

      let updatedArea;
      if (editingArea) {
        updatedArea = await areaService.updateArea(
          editingArea.id_area,
          areaData
        );
        setAreas((prev) =>
          prev.map((a) =>
            a.id_area === editingArea.id_area ? updatedArea : a
          )
        );
      } else {
        const newArea = await areaService.createArea(areaData);
        setAreas((prev) => [...prev, newArea]);
      }

      showToast(`Área ${editingArea ? "actualizada" : "creada"} exitosamente`, "success");
    } catch (err) {
      showToast(err.message || "Error al guardar el área", "error");
    } finally {
      setIsSubmitting(false);
      setShowCreateModal(false);
      setEditingArea(null);
    }
  };

  const filteredAreas = areas.filter(
    (area) =>
      area.nombre_area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.departamento?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <motion.div
    className="no-areas"
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    Cargando áreas...
  </motion.div>;
  if (error) return <div className="no-areas">{error}</div>;

  return (
    <div className="area-list-container">
      <div className="area-list-header">
        <div className="header-top">
          <motion.button
            initial={{ opacity: 0, scale: .8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.8, boxShadow: "0px 2px 6px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="create-button"
            onClick={() => setShowCreateModal(true)}
            style={{ width: "140px" }}
          >
            <i className="fa-solid fa-plus"></i> Crear Área
          </motion.button>
        </div>
        <input
          type="text"
          placeholder="Buscar área..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredAreas.length === 0 ? (
        <div className="no-areas">No se encontraron áreas</div>
      ) : (
        <motion.div
          className="areas-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <AnimatePresence>
            {filteredAreas.map((area, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.1, delay: index * 0.07 }} // delay progresivo
                className="user-card"
              >
                <div className="area-card-header">
                  <h3>{area.nombre_area}</h3>
                  <div className="area-actions">
                    <motion.button
                      initial={{ opacity: 0, scale: .8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      onClick={() => handleEditArea(area)}
                      className="edit-button"
                      title="Editar área"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, scale: .8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      onClick={() => handleDeleteClick(area)}
                      className="delete-button"
                      title="Eliminar área"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </motion.button>
                  </div>
                </div>
                <div className="area-card-content">
                  <p className="area-department">
                    <i className="fa-solid fa-building"></i>
                    {area.departamento}
                  </p>
                  <p className="area-description">
                    <i className="fa-solid fa-align-left"></i>
                    {area.descripcion || "Sin descripción"}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {showCreateModal && (
        <CreateAreaModal
          onClose={() => {
            if (!isSubmitting) {
              setShowCreateModal(false);
              setEditingArea(null);
            }
          }}
          onSave={handleSaveArea}
          editArea={editingArea}
          isSubmitting={isSubmitting}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          message={`¿Estás seguro de que quieres eliminar el área ${areaToDelete.nombre_area}?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            if (!isDeleting) {
              setShowConfirmModal(false);
              setAreaToDelete(null);
            }
          }}
          isLoading={isDeleting}
        />
      )}


    </div>
  );
};

export default AreaList;
