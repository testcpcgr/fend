import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";

const PrivateRoute = ({ roles }) => {
    const isAuthenticated = useIsAuthenticated();   
    if (!isAuthenticated) {      
        return <Navigate to={{ pathname: '/' }} />
    }
    return <Outlet />
}

export default PrivateRoute;