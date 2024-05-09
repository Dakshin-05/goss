import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { token, user } = useAuth();

  if (!token || !user?.id) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
