import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from "./AuthProvider";

export const ProtectedRoute = ({ children }) => {
  const { token, loaded } = useAuthContext();

  if (loaded) {
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    return children;
  }

  return <p>Loading</p>;

};