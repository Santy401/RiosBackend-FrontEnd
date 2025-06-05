import "../styles/adminAside.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import UserList from "../components/userList.jsx";
import CompanyList from "../components/CompanyList.jsx";
import AreaList from "../components/AreaList.jsx";
import ClientList from "../components/ClientList.jsx";
import DashboardAdmin from "../components/DashboardAdmin.jsx";
import Tasks from "../components/Tasks.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, LayoutDashboard, ListChecks, ListPlus, Bolt, ChevronDown } from "lucide-react";
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [activeList, setActiveList] = useState("users");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    toast.success('¡Bienvenido! Interactuas como Administrador');
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
      case "clients":
        return <ClientList />;
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
      default:
        return null;
    }
  };

  return (
    <div className="bigC">
      <aside className={`asideNv ${isSidebarVisible ? "" : "hidden"}`}>
        <div className="topItems">
          <div
            className="header-container"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <h5>
              <i className="fa-solid fa-user-tie"></i> Admin.Task
            </h5>
            <ChevronDown
              className={`dropdown-icon ${isDropdownOpen ? "rotate" : ""}`}
            />
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
            <div className="itemBar2">
              <LayoutDashboard />
              <span onClick={() => handleChangeComponent("dashboard")}>
                Dashboard
              </span>
            </div>
          </div>

          <div className={activeComponent === "notifications" ? "active" : ""}>
            <div className="itemBar2">
              <Inbox />
              <span onClick={() => handleChangeComponent("notifications")}>
                Notificaciones
              </span>
            </div>
          </div>

          <div className="divider"></div>

          <div className={activeComponent === "tasks" ? "active" : ""}>
            <div className="itemBar2">
              <ListChecks />
              <span onClick={() => handleChangeComponent("tasks")}>
                Tasks
              </span>
            </div>
          </div>

          <div className={activeComponent === "lists" ? "active" : ""}>
            <div className="itemBar2">
              <ListPlus />
              <span onClick={() => handleChangeComponent("lists")}>
                Listas
              </span>
            </div>
          </div>
        </div>

        <div className="bottomItems">
          <label className="labelBottom">Configuración</label>
          <button>
            <Bolt className="bolt" /> Preferencias
          </button>
        </div>
      </aside>

      <main
        style={{
          overflowY: "scroll",
          height: "105vh",
          position: "relative",
          left: isSidebarVisible ? "20px" : "20px",
          width: isSidebarVisible ? "calc(100% - 0px)" : "100%",
          transition: "all 0.3s ease",
        }}
        className="overScroll"
      >
        <button
          className="toggle-menu"
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          <i
            className={`fa-solid ${
              isSidebarVisible ? "fa-arrow-left" : "fa-arrow-right"
            }`}
          ></i>
        </button>

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
