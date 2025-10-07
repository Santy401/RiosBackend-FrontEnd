import { Navigate } from "react-router-dom";

const PrivateRoute = ({ role, children }) => {
  if (!role) {
    return <Navigate to="/" />;
  }
  return children;
};


export default PrivateRoute;
