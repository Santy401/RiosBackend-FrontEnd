import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserList from "../components/ListsComponents/userList.jsx";
import CompanyList from "../components/ListsComponents/CompanyList.jsx";
import AreaList from "../components/ListsComponents/AreaList.jsx";
import "../pages/styles/ListsPage.css";

const ListsPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/admin");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserList />;
      case "companies":
        return <CompanyList />;
      case "areas":
        return <AreaList />;
      default:
        return <UserList />;
    }
  };

  return (
    <div className="lists-page-container">
      <div className="header-container">
        <button className="back-button" onClick={handleGoBack}>
          <i className="fa-solid fa-arrow-left"></i> Volver
        </button>
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <i className="fa-solid fa-users"></i> Usuarios
          </button>
          <button
            className={`tab-button ${
              activeTab === "companies" ? "active" : ""
            }`}
            onClick={() => setActiveTab("companies")}
          >
            <i className="fa-solid fa-building"></i> Empresas
          </button>
          <button
            className={`tab-button ${activeTab === "areas" ? "active" : ""}`}
            onClick={() => setActiveTab("areas")}
          >
            <i className="fa-solid fa-diagram-project"></i> Áreas
          </button>
        </div>
      </div>

      <div className="tab-content">{renderContent()}</div>
    </div>
  );
};

export default ListsPage;
