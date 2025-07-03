import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoutes = ({ children, requiredRole }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/signin" />; // Redirect to sign-in if not logged in
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />; // Redirect to home if role doesn't match
  }

  return children; // Allow access if user is authenticated and has the required role
};

export default ProtectedRoutes;