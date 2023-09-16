import React from 'react';
import {  Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { user } = useAuth();

  return (
    <React.Fragment>
      {user ? children : <Navigate to="/login" replace />}
    </React.Fragment>
  );
}

export default PrivateRoute;