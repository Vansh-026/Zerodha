import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../landing_page/AuthContext'; // make sure this path is correct

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
