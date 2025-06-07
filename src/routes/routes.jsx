import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import UserDashboard from "../pages/UserDashboard.jsx";
import PrivateRoute from "./privateRoute.jsx";

// eslint-disable-next-line react/prop-types
const AppRoutes = ({ user, loading, onLogin, onLogout }) => {
  if (loading) {
    return <div>Cargando...</div>; 
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            // eslint-disable-next-line react/prop-types
            <Navigate to={`/${user.role}`} />
          ) : (
            <Login onLogin={onLogin} />
          )
        }
      />
      <Route
        path="/admin"
        element={
          // eslint-disable-next-line react/prop-types
          <PrivateRoute role={user?.role === "admin"}>
            <AdminDashboard onLogout={onLogout} />
          </PrivateRoute>
        }
      />
      <Route
        path="/user"
        element={
          // eslint-disable-next-line react/prop-types
          <PrivateRoute role={user?.role === "user"}>
            <UserDashboard onLogout={onLogout} />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
