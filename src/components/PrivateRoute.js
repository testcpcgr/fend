import React from 'react';
import { Route, Redirect, Navigate, Outlet } from 'react-router-dom';

import { authenticationService } from '../services/authentication.service';

const PrivateRoute = ({ roles }) => {
    const currentUser = authenticationService.currentUserValue;
    if (!currentUser) {
        // not logged in so redirect to login page with the return url
        return <Navigate to={{ pathname: '/login' }} />
    }
    if (roles && roles.indexOf(currentUser.role) === -1) {
        // role not authorised so redirect to home page
        return <Navigate to={{ pathname: '/' }} />
    }
    return <Outlet />
}

export default PrivateRoute;