import { useState, useEffect } from "react";
import "../components/styles/AdminDashboard.css";
import "../components/styles/ModalAddTask.css";
import PanelControlTask from "../components/PanelControlTask.jsx";
import "../components/styles/PanelControlTask.css";

const DashboardAdmin = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModalAdd = () => {
    setModalOpen(!isModalOpen);
  };
  return (
    <div className="content-G">
      <section>
        <PanelControlTask panel={toggleModalAdd} />
      </section>
    </div>
  );
};

export default DashboardAdmin;
