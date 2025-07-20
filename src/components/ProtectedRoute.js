import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Se a rota requer autenticação e o usuário não está autenticado
  if (requireAuth && !isAuthenticated) {
    // Salvar a localização que o usuário tentou acessar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se a rota é para usuários não autenticados (como login/register) e o usuário está autenticado
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
