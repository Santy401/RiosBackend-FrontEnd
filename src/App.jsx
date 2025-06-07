import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardAdmin from "./pages/AdminDashboard";
import DashboardUser from "./pages/UserDashboard";
import Login from "./pages/Login";
import "./styles/globals.css";
import AreaList from "./components/ListsComponents/AreaList";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard-admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard-user"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <DashboardUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <Navigate
                to={
                  localStorage.getItem("user")
                    ? JSON.parse(localStorage.getItem("user")).role === "admin"
                      ? "/dashboard-admin"
                      : "/dashboard-user"
                    : "/login"
                }
              />
            }
          />

          <Route
            path="/areas"
            element={
              <ProtectedRoute>
                <AreaList />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to={
                  localStorage.getItem("user")
                    ? JSON.parse(localStorage.getItem("user")).role === "admin"
                      ? "/dashboard-admin"
                      : "/dashboard-user"
                    : "/login"
                }
              />
            }
          />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
}

export default App;
