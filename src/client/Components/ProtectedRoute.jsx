import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element }) => {
  const { authData } = useAuth();
  const loggedIn = Boolean(authData.token);

  return loggedIn ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;