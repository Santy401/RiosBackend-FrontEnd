import "../styles/adminAside.css";
import "../pages/styles/ListsPage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import UserList from "../components/ListsComponents/userList.jsx";
import CompanyList from "../components/ListsComponents/CompanyList.jsx";
import AreaList from "../components/ListsComponents/AreaList.jsx";
import DashboardAdmin from "./DashboardAdmin.jsx";
import Tasks from "../components/Tasks.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, LayoutDashboard, ListChecks, ListPlus, Settings, LogOut, ChevronDown, PanelRightClose } from "lucide-react";
import { toast } from 'react-toastify';
import Icon from "../assets/Logo.png";
import Notifications from "./Nofications.jsx";
import Preferences from "./Preferences.jsx";

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [activeList, setActiveList] = useState("users");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    toast.success('¡Bienvenido! Administrador', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light',
    });
  }, []);

  const handleChangeComponent = (Component) => {
    setActiveComponent(Component);
    if (Component === "lists") {
      setActiveList("users");
    }
  };

  const handleChangeList = (listType) => {
    setActiveList(listType);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderListContent = () => {
    switch (activeList) {
      case "users":
        return <UserList />;
      case "companies":
        return <CompanyList />;
      case "areas":
        return <AreaList />;
      default:
        return null;
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Tasks />;
      case "tasks":
        return <DashboardAdmin />;
      case "lists":
        return (
          <div className="lists-container">
            <div className="lists-header">
              <h2>Gestión de Listas</h2>
              <div className="lists-tabs">
                <button
                  onClick={() => handleChangeList("users")}
                  className={activeList === "users" ? "active" : ""}
                >
                  Usuarios
                </button>
                <button
                  onClick={() => handleChangeList("companies")}
                  className={activeList === "companies" ? "active" : ""}
                >
                  Empresas
                </button>
                <button
                  onClick={() => handleChangeList("areas")}
                  className={activeList === "areas" ? "active" : ""}
                >
                  Áreas
                </button>
              </div>
            </div>
            {renderListContent()}
          </div>
        );
      case "notifications":
        return <Notifications />;
      case "preferences":
        return <Preferences />;
      default:
        return null;
    }
  };

  return (
    <div className="bigC">
      <aside className={`asideNv ${isSidebarVisible ? "" : "hidden"}`}>
        <div className="topItems">
          <button
            className="toggle-sidebar-btn"
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            title="Ocultar/Mostrar panel"
          >
            <PanelRightClose />
          </button>
          <div
            className="header-container"
          >
            <h5 className="text-logo">
              <img src={Icon} alt="Logo" className="logo" /> RiosTask
            </h5>
          </div>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                className="dropdown-contentt"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ transformOrigin: "top" }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className="dropdown-item"
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Cerrar sesión
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="itemBar1"></div>

        <div className="itemsMedie">
          <div className={activeComponent === "dashboard" ? "active" : ""}>
            <div className={activeComponent === "dashboard" ? "" : "itemBar2"}>
              <LayoutDashboard />
              <span onClick={() => handleChangeComponent("dashboard")}>
                Inicio
              </span>
            </div>
          </div>

          <div className={activeComponent === "notifications" ? "active" : ""}>
            <div className={activeComponent === "notifications" ? "" : "itemBar2"}>
              <Inbox />
              <span onClick={() => handleChangeComponent("notifications")}>
                Notificaciones
              </span>
            </div>
          </div>

          <div className="divider"></div>

          <div className={activeComponent === "tasks" ? "active" : ""}>
            <div className={activeComponent === "tasks" ? "" : "itemBar2"}>
              <ListChecks />
              <span onClick={() => handleChangeComponent("tasks")}>
                Tareas
              </span>
            </div>
          </div>

          <div className={activeComponent === "lists" ? "active" : ""}>
            <div className={activeComponent === "lists" ? "" : "itemBar2"}>
              <ListPlus />
              <span onClick={() => handleChangeComponent("lists")}>
                Listas
              </span>
            </div>
          </div>
        </div>

        <div className="bottomItems">
        <div className="content-user-info" onClick={() => setIsOpen(!isOpen)}>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="user-dropdown"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
              >
                <p onClick={() => handleChangeComponent("preferences")}><Settings className="icon-user" />Preferencias</p>
                <p onClick={logout}><LogOut className="icon-user" />Cerrar sesión</p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="Content-user-info-rw"><img src="https://img.freepik.com/premium-vector/human-icon_970584-3.jpg?semt=ais_hybrid&w=740" alt="UserProfile" className="user-image" />
            <div className="content-details-user">
              <span className="Name-user">{user?.name || 'Usuario'}</span>
              <span className="Email-user">{user?.email || 'usuario@ejemplo.com'}</span>
            </div>
            <div className="arrows">
              <ChevronDown className="arrow-icon" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
            </div>
          </div>
        </div>
        </div>

      </aside>

      <main
        className="overScroll"
        style={{
          overflowY: "scroll",
          height: "105vh",
          position: "relative",
          left: isSidebarVisible ? "20px" : "20px",
          width: isSidebarVisible ? "calc(100% - 0px)" : "100%",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      >
        {isSidebarVisible ? null : (
          <div
            style={{
              opacity: 1,
              transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            <button
              className="show-sidebar-btn"
              onClick={() => setIsSidebarVisible(true)}
              style={{
                position: 'absolute',
                left: '7px',
                top: '20px',
                zIndex: 1000,
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '100px',
                padding: '11px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                scale: '.8'
              }}
            >
              <i className={`fa-solid ${isSidebarVisible ? 'fa-arrow-left' : 'fa-arrow-right'}`} style={{ fontSize: '20px', color: 'white' }} />
            </button>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeComponent}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ position: "absolute", width: "100%" }}
          >
            {renderComponent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
