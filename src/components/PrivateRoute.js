import React from 'react';
import { Route, Redirect, Navigate, Outlet } from 'react-router-dom';

import { authenticationService } from '../services/authentication.service';

const PrivateRoute = ({ roles }) => {
    const currentUser = authenticationService.currentUserValue;
    if (!currentUser) {      
        return <Navigate to={{ pathname: '/login' }} />
    }
    if (roles && roles.indexOf(currentUser.role) === -1) {
        return <Navigate to={{ pathname: '/' }} />
    }    
    return <Outlet />
}

export default PrivateRoute;