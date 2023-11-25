import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component }) => {
  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem('userToken') !== null;

  // If authenticated, render the component passed to this protected route
  // Otherwise, redirect to the authentication page
  return isAuthenticated ? <Component /> : <Navigate to="/auth" />;
};

export default ProtectedRoute;
