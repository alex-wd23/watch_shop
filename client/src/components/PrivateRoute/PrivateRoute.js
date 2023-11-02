import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, token }) => {
  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute