import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


const TaskComplete = ({ completedTasks, taskList, setTaskList, users, formatDate }) => {

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const reorderedTasks = Array.from(taskList);
        const [movedTask] = reorderedTasks.splice(result.source.index, 1);
        reorderedTasks.splice(result.destination.index, 0, movedTask);
        setTaskList(reorderedTasks);
      };
    
  return (
    <div className="boxTask2">
    <div className="topBox">
      <div className="alignItemsL">
        <h4>Tareas Completadas</h4>
        <div className="activity">
          <span>
            <i className="fa-solid fa-boxes-stacked"></i>
            Terminadas
          </span>
        </div>
      </div>
    </div>
    <div className="MediunBox2">
      <span>
        <i className="fa-solid fa-check"></i> Terminadas
      </span>
    </div>
    <div className="boxTask2">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="completedTasks">
          {(provided) => (
            <table
              className="task-table"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <thead>
                <tr>
                  <th>
                    <i className="fa-solid fa-file-signature"></i> Tarea
                  </th>
                  <th>
                    <i className="fa-solid fa-message"></i> Descripción
                  </th>
                  <th>
                    <i className="fa-solid fa-users"></i> Persona
                  </th>
                  <th>
                    <i className="fa-solid fa-hourglass-half"></i> Limite
                  </th>
                  <th>
                    <i className="fa-solid fa-pen-to-square"></i> Área
                  </th>
                  <th>
                    <i className="fa-solid fa-building"></i> Empresa
                  </th>
                </tr>
              </thead>
              <tbody>
                {completedTasks && completedTasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <td>{task.title}</td>
                        <td>{task.observation}</td>
                        <td>
                          {users.find(
                            (user) => user.email === task.user
                          ) ? (
                            <div className="user-email-container">
                              <i className="fa-regular fa-user"></i>
                              <div className="tooltip">{task.user}</div>
                            </div>
                          ) : (
                            <span>No seleccionado</span>
                          )}
                        </td>
                        <td>
                          {formatDate(task.createdDate)}
                          {task.time ? formatDate(task.time) : ""}
                        </td>
                        <td>{task.projects || "Sin área"}</td>
                        <td>{task.company || "No asignada"}</td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  </div>


  )
}
TaskComplete.propTypes = {
  completedTasks: PropTypes.array.isRequired,
  taskList: PropTypes.array.isRequired,
  setTaskList: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  formatDate: PropTypes.func.isRequired,
};

export default TaskComplete
