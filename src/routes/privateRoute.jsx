import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ role, children }) => {
  if (!role) {
    return <Navigate to="/" />;
  }
  return children;
};


export default PrivateRoute;
