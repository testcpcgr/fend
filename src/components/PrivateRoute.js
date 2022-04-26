import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";
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