import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isUser = localStorage.getItem("userData");

  if (!isUser) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
