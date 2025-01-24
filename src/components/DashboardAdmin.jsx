import { useState, useEffect } from "react";
import "../components/styles/AdminDashboard.css";
import "../components/styles/ModalAddTask.css";
import PanelControlTask from "../components/PanelControlTask.jsx";
import "../components/styles/PanelControlTask.css";

const DashboardAdmin = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const hours = currentTime.getHours();
  const isNight = hours >= 19 || hours < 6;
  const icon = isNight ? "🌙" : "☀️";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const daysOfWeek = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayOfWeek = daysOfWeek[currentTime.getDay()];
  const dayOfMonth = currentTime.getDate();
  const month = months[currentTime.getMonth()];
  const year = currentTime.getFullYear();

  const toggleModalAdd = () => {
    setModalOpen(!isModalOpen);
  };
  return (
    <div className="content-G">
      <div className="top-accions">
        <div>
          <span>!HOLA ADMIN! {icon}</span>
          <span>
            Hoy es {dayOfWeek}, {dayOfMonth} {month} {year}
          </span>
        </div>
        <span>
          {currentTime.toLocaleTimeString()}
        </span>
          <div style={{opacity:"0", cursor:"default"}}>holaaaaaaaaaaa</div>
      </div>
      <section>
        <PanelControlTask panel={toggleModalAdd} />
      </section>
    </div>
  );
};

export default DashboardAdmin;
