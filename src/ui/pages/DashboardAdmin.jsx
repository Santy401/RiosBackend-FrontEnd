import { useState } from "react";
import "./styles/Dashboard.css";
import "../components/CreateComponents/styles/ModalAddTask.css";
import PanelControlTask from "../components/Panels/PanelControlTask.jsx";
import "../components/Panels/styles/PanelControlTask.css";

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
