import "../components/styles/PanelControlTask.css";
import "../components/styles/PanelHeader.css";
import { useState, useEffect } from "react";
import TaskTable from "../components/TaskTable.jsx";
import CreateTaskModal from "../components/CreateTaskModal.jsx";
import { taskService } from "../services/taskService.js";
import { useAuth } from "../context/authContext";
import { getAllTasks } from "../services/taskService";
import Notification from "./Notification";
import ConfirmModal from "./ConfirmModal";

const PanelControlTask = () => {
  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTasks(user?.id, user?.role);
      setTasks(data);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
      setError("No se pudieron cargar las tareas");
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
        setNotification({
          message:
            "Por favor completa los campos obligatorios: Nombre y el asignado",
          type: "error",
        });
        return;
      }

      const formattedDueDate = taskData.dueDate
        ? new Date(taskData.dueDate).toISOString().slice(0, 16)
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
        status: "pending",
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
      }

      setShowCreateModal(false);
      loadTasks();
    } catch (error) {
      console.error("Error al guardar tarea:", error);
      setNotification({
        message: error.response?.data?.message || "Error al guardar la tarea",
        type: "error",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (task) => {
    if (!task || typeof task.id === "undefined") {
      setNotification({
        message: "No se puede eliminar la tarea: datos inválidos",
        type: "error",
      });
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
      const result = await taskService.deleteTask(taskToDelete.id);

      if (!result || typeof result.taskId === "undefined") {
        throw new Error("Error en la respuesta del servidor");
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskToDelete.id)
      );
      setNotification({
        message: "Tarea eliminada exitosamente",
        type: "success",
      });
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      setNotification({
        message: error.message || "Error al eliminar la tarea",
        type: "error",
      });
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
      setNotification({
        message: "Error al actualizar el estado de la tarea",
        type: "error",
      });
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
    <div className="panel-control">
      <div className="panel-header">
        <h2>Listado de Tareas</h2>
        <button
          className="create-button"
          onClick={() => {
            setEditingTask(null);
            setShowCreateModal(true);
          }}
        >
          <i className="fa-solid fa-plus"></i> Crear Tarea
        </button>
      </div>

      <TaskTable
        tasks={tasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteClick}
        onStatusChange={handleStatusChange}
      />

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateTask}
          editTask={editingTask || null}
          isLoading={isCreating}
        />
      )}

      {showConfirmModal && taskToDelete && (
        <ConfirmModal
          message={`¿Estás seguro de que quieres eliminar la tarea "${taskToDelete.title}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowConfirmModal(false);
            setTaskToDelete(null);
          }}
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

export default PanelControlTask;
