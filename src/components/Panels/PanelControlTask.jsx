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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCreateTask = async (taskData) => {
    try {
      setIsCreating(true);

      console.log(
        "ID de tarea para actualización:",
        editingTask ? editingTask.id : "ID no definido"
      );

      if (!taskData.title || !taskData.assigned_to) {
        showToast("Por favor completa los campos obligatorios: Nombre y el asignado", "error");
        return;
      }

      const formattedDueDate = taskData.dueDate
        ? new Date(taskData.dueDate).toISOString().slice(0, 16)  // Esto es correcto si necesitas sólo año, mes, día, hora y minutos
        : null;


      const formattedData = {
        ...taskData,
        title: taskData.title || "Sin nombre",
        assigned_to: String(taskData.assigned_to),
        observation: taskData.observation || "Sin descripción",
        company_id: taskData.company_id || "",
        area_id: taskData.area_id || "",
        dueDate: formattedDueDate,
        updateAt: new Date().toISOString(),
        status: taskData.status || "in_progress",
      };

      if (editingTask && editingTask.id) {
        console.log("ID de tarea para actualización:", editingTask.id);
        const updatedTask = await taskService.updateTask(
          editingTask.id,
          formattedData
        );

        if (updatedTask && updatedTask.task) {
          console.log("Tarea actualizada correctamente:", updatedTask.task);
        } else {
          console.error("Respuesta inesperada del servidor:", updatedTask);
        }

        if (updatedTask && updatedTask.task) {
          console.log("Tarea actualizada correctamente:", updatedTask.task);
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.task.id ? updatedTask.task : task
            )
          );
        }
      } else {
        const newTask = await taskService.createTask(formattedData);
        setTasks((prevTasks) => [...prevTasks, newTask]);
        showToast("Tarea creada exitosamente", "success");
      }

      setShowCreateModal(false);
      loadTasks();
    } catch (error) {
      console.error("Error al guardar tarea:", error);
      showToast(error.response?.data?.message || "Error al guardar la tarea", "error");
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
    return <div className="loading">Cargando tareas...</div>;
  }

  return (
    <div className="wontrol">
      <div className="panel-header">
        <h1>Panel De Tareas</h1>
        <motion.button
          className="create-button"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          onClick={() => {
            setEditingTask(null);
            setShowCreateModal(true);
          }}
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
