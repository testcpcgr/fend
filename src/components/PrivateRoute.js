import React from 'react';
import { Route, Redirect, Navigate, Outlet } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";
import { authenticationService } from '../services/authentication.service';

const PrivateRoute = ({ roles }) => {
    const isAuthenticated = useIsAuthenticated();   
    if (!isAuthenticated) {      
        return <Navigate to={{ pathname: '/' }} />
    }
    return <Outlet />
}

export default PrivateRoute;