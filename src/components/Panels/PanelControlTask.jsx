import "./styles/PanelControlTask.css";
import "./styles/PanelHeader.css";
import { useState, useEffect } from "react";
import TaskTable from "../tasktable/TaskTable.jsx";
import CreateTaskModal from "../CreateComponents/CreateTaskModal.jsx";
import { taskService } from "../../services/taskService.js";
import { useAuth } from "../../context/authContext.jsx";
import { getAllTasks } from "../../services/taskService.js";
import { showToast } from "../common/ToastNotification.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

const PanelControlTask = () => {
  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTasks(user?.id, user?.role);

      // Asegúrate que data sea un array
      const tasksArray = Array.isArray(data) ? data : [];

      setTasks(tasksArray);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
      setError("No se pudieron cargar las tareas");
      setTasks([]); // Asegura que tasks sea array incluso en caso de error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadTasks();
    }
  }, [user]);

  const handleCreateTask = async (taskData) => {
    try {
      setIsCreating(true);
      
      // Asegúrate de que la fecha esté en el formato correcto
      const formattedData = {
        ...taskData,
        due_date: taskData.due_date // Ya viene en formato YYYY-MM-DD
      };
  
      console.log("📤 Datos del formulario:", {
        ...formattedData,
        due_date: formattedData.due_date,
        due_date_type: typeof formattedData.due_date
      });
  
      // Validaciones
      if (!formattedData.title) throw new Error('El título es obligatorio');
      if (!formattedData.assigned_to) throw new Error('La persona asignada es obligatoria');
      if (!formattedData.due_date) throw new Error('La fecha límite es obligatoria');
  
      // Preparar datos
      const taskToSave = {
        ...formattedData,
        due_date: formattedData.due_date // Ya viene en formato YYYY-MM-DD
      };
  
      console.log("📤 Enviando al backend:", taskToSave);
  
      let result;
      if (editingTask?.id) {
        result = await taskService.updateTask(editingTask.id, taskToSave);
        showToast("Tarea actualizada exitosamente", "success");
      } else {
        result = await taskService.createTask(taskToSave);
        showToast("Tarea creada exitosamente", "success");
      }
  
      setShowCreateModal(false);
      loadTasks();
      return result;
    } catch (error) {
      console.error("❌ Error al guardar tarea:", error);
      showToast(error.message || "Error al guardar la tarea", "error");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (task) => {
    if (!task || typeof task.id === "undefined") {
      showToast("No se puede eliminar la tarea: datos inválidos", "error");
      return;
    }
    setTaskToDelete(task);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!taskToDelete || typeof taskToDelete.id === "undefined") {
        throw new Error("No se puede eliminar: tarea inválida");
      }

      await taskService.deleteTask(taskToDelete.id); // No necesitas asignarlo a `result`
      console.log("✅ Tarea eliminada en el backend");

      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter(
          (task) => task.id !== taskToDelete.id
        );
        console.log(
          "📌 Tareas después de eliminar en el frontend:",
          updatedTasks
        );
        return updatedTasks;
      });

      showToast("Tarea eliminada exitosamente", "success");
    } catch (error) {
      console.error("❌ Error al eliminar tarea:", error);
      showToast(error.message || "Error al eliminar la tarea", "error");
    } finally {
      setShowConfirmModal(false);
      setTaskToDelete(null);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      loadTasks();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      showToast("Error al actualizar el estado de la tarea", "error");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowCreateModal(true);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (loading) {
    return <div class="loader"></div>;
  }
  
  return (
    <div className="control">
      <div className="panel-header">
        <h1>Panel De Tareas</h1>
        <motion.button
          className="create-button"
          initial={{ opacity: 0, scale: .8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          onClick={() => {
            setEditingTask(null);
            setShowCreateModal(true);
          }}
          style={{ width: "fit-content" }}
        >
          <i className="fa-solid fa-plus"></i> Crear Tarea
        </motion.button>

      </div>

      <TaskTable
        tasks={tasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteClick}
        onStatusChange={handleStatusChange}
      />

      <AnimatePresence>
        {showCreateModal && (
          <CreateTaskModal
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateTask}
            editTask={editingTask || null}
            isLoading={isCreating}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmModal && taskToDelete && (
          <ConfirmModal
            message={`¿Estás seguro de que quieres eliminar la tarea "${taskToDelete.title}"?`}
            onConfirm={handleConfirmDelete}
            isLoading={isCreating}
            onCancel={() => {
              setShowConfirmModal(false);
              setTaskToDelete(null);
            }}
          />
        )}
      </AnimatePresence>


    </div>
  );
};

export default PanelControlTask;
