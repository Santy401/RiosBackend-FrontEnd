import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

// eslint-disable-next-line react/prop-types
const DropdownMenu = ({ taskId, onEdit, onDelete, onShowDetails, onComplete }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuVisible((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="task-actions">
      <div className="dropdown">
        <button className="dropbtn" onClick={toggleMenu}>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
        {menuVisible && (
          <div className="dropdown-content" ref={menuRef}>
            <button
              onClick={() => {
                console.log("Editando tarea", taskId);
                onEdit(taskId);
              }}
            >
              Editar
            </button>

            <button onClick={() => onDelete(taskId)}>Borrar</button>
            <button onClick={() => onShowDetails(taskId)}>
              Mostrar detalles
            </button>
            <button onClick={() => onComplete(taskId)}>terminada</button>
          </div>
        )}
      </div>
    </div>
  );
};

DropdownMenu.propTypes = {
  taskId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShowDetails: PropTypes.func.isRequired,
};

export default DropdownMenu;
