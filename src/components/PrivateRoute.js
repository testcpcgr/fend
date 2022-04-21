import React from 'react';
import { Route, Redirect, Navigate, Outlet } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";
import { authenticationService } from '../services/authentication.service';
import PermissionProvider from './PermissionProvider';

const PrivateRoute = ({
    permissionList,
    redirectPath = '/landing',
    module,
    permissionLevel
  }) => {
    const isAuthenticated = useIsAuthenticated();    
    if (!isAuthenticated) {      
        return <Navigate to={{ pathname: '/' }} />
    }
    if(PermissionProvider({ permissionDetails: permissionList, moduleName: module, permissionLevel: permissionLevel }))
        return <Outlet />
    else
        return <Navigate to={{ pathname: '/' }} />
}

export default PrivateRoute;