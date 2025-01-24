import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  console.log("Usuario actual:", user); 
  console.log("Roles permitidos:", allowedRoles); 

  if (!user) {
    console.log("No hay usuario, redirigiendo a login"); 
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log("Usuario no tiene permisos, redirigiendo"); 
    return user.role === "admin" ? (
      <Navigate to="/dashboard-admin" />
    ) : (
      <Navigate to="/dashboard-user" />
    );
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
