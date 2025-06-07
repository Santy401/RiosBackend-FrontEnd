import {useState, useEffect} from "react";
import ListTaskUser from "../components/UserListTask.jsx";

const PanelControlTaskUser = () => {
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
    
  return (
   <div className="content-G">
        <div className="top-accions">
          <div>
            <span>! HOLA USUARIO ! {icon}</span>
            <span>
              Hoy es {dayOfWeek}, {dayOfMonth} {month} {year}
            </span>
          </div>
          <span style={{ position: "relative", right: "7%" }}>
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
        <ListTaskUser />
      </div>
  )
}

export default PanelControlTaskUser
