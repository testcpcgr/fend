import React from 'react';
import { Route, Redirect, Navigate, Outlet } from 'react-router-dom';

import { authenticationService } from '../services/authentication.service';

const PermissionProvider = ({ roles }) => {    
    const currentUser = authenticationService.currentUserValue;    
    if (!currentUser) {
        return false;
    }
    if (roles && roles.indexOf(currentUser.role) === -1) {
        return false;
    }    
    return true;
}

export default PermissionProvider;