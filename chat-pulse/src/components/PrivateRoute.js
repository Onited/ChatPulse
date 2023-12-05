import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Utils/AuthContext'; // Assurez-vous que ce hook existe et est bien configuré

const PrivateRoute = () => {
  const { currentUser } = useAuth(); // useAuth est un hook qui retourne l'état d'authentification actuel

  return currentUser ? <Outlet /> : <Navigate to="/register" />;
};

export default PrivateRoute;
