import "../styles/adminAside.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import UserList from "../components/userList.jsx";
import CompanyList from "../components/CompanyList.jsx";
import AreaList from "../components/AreaList.jsx";
import ClientList from "../components/ClientList.jsx";
import DashboardAdmin from "../components/DashboardAdmin.jsx";

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [activeList, setActiveList] = useState("users");
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="bigC">
      <aside className="asideNv">
        <div className="topItems">
          <div className="itemBar0">
            <h5>
              <i className="fa-solid fa-user-tie"></i>Admin.Task
            </h5>
          </div>
          <div className="itemBar1"> </div>
          <div className="searchAlignIcon">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="search" name="" id="" placeholder="Busca" />
          </div>
          <div className="itemsMedie">
            <div>
              <i className="fa-solid fa-table-columns"></i>
              <button onClick={() => handleChangeComponent("dashboard")}>
                Dashboard
              </button>
            </div>
            <div>
              <i className="fa-solid fa-bell"></i>
              <button onClick={() => handleChangeComponent("notifications")}>
                Notificaciones
              </button>
            </div>
            <div>
              <i className="fa-solid fa-list"></i>
              <button onClick={() => handleChangeComponent("lists")}>
                Listas
              </button>
            </div>
          </div>
        </div>
        <div className="bottomItems">
          <button>
            <i className="fa-solid fa-gear"></i> Configuracion
          </button>
          <button onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Cerrar sesión
          </button>
        </div>
      </aside>
      <main
        style={{
          overflowY: "scroll",
          height: "105vh",
          position: "relative",
          left: "3%",
        }}
        className="overScroll"
      >
        {activeComponent === "dashboard" && <DashboardAdmin />}
        {activeComponent === "lists" && (
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
                <button
                  onClick={() => handleChangeList("clients")}
                  className={activeList === "clients" ? "active" : ""}
                >
                  Clientes
                </button>
              </div>
            </div>
            {renderListContent()}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
