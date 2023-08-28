import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, isAuthenticated, allowedRoles, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated && allowedRoles.includes(sessionStorage.getItem('role')) ? (
        <element {...props} />
      ) : (
        <Navigate to="/" />
      )
    }
  />
);

export default ProtectedRoute;