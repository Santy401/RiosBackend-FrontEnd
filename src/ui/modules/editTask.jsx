import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/FormEditTask.css";

const EditTask = ({ task, areas, companies, setIsEditing, onSave }) => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUserList(storedUsers);
  }, []);

  return (
    <div className="edit-modal">
      <div className="backdrop"></div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const updatedTask = {
            ...task,
            title: e.target.title.value,
            observation: e.target.observation.value,
            user: e.target.user.value,
            deadline: e.target.deadline.value,
            projects: e.target.projects.value,
            company: e.target.company.value,
          };
          onSave(updatedTask);
        }}
        className="form1"
      >
        <div>
          <input
            type="text"
            name="title"
            defaultValue={task.title}
            placeholder="Titulo De Tarea"
            className="titleTask"
          />
        </div>
        <div className="inputsEdit">
          <div>
            <label>Encargado:</label>
            <select name="user" defaultValue="">
              <option value="" disabled></option>
              {userList.map((user) => (
                <option key={user.email} value={user.email}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Area:</label>
            <select name="projects" defaultValue="">
              <option value="" disabled></option>
              {areas.map((area, index) => (
                <option key={index} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Empresa:</label>
            <select name="company" defaultValue="">
              <option value="" disabled></option>
              {companies.map((company, index) => (
                <option key={index} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Fecha límite:</label>
            <input type="date" name="deadline" defaultValue={task.deadline} />
          </div>
        </div>
        <div className="textArea">
          <textarea
            name="observation"
            placeholder="Observacion"
            defaultValue={task.observation}
          ></textarea>
        </div>
        <div className="bt-accions">
          <button type="submit">Guardar cambios</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

EditTask.propTypes = {
  task: PropTypes.shape({
    title: PropTypes.string,
    observation: PropTypes.string,
    user: PropTypes.string,
    deadline: PropTypes.string,
    projects: PropTypes.string,
    company: PropTypes.string,
  }).isRequired,
  areas: PropTypes.arrayOf(PropTypes.string).isRequired,
  companies: PropTypes.arrayOf(PropTypes.string).isRequired,
  setIsEditing: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditTask;
