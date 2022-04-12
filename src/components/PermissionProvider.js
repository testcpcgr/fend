import React from 'react';
import { Route, Redirect, Navigate, Outlet } from 'react-router-dom';

import { authenticationService } from '../services/authentication.service';

const PermissionProvider = ({ permissionDetails, moduleName, permissionLevel }) => {

    let list = permissionDetails.filter(row => row.ModuleDiscription==moduleName && (row.PermissionDescription == permissionLevel || row.PermissionDescription == "All"))
    //console.log(permissionDetails,moduleName, permissionLevel )
    if (list.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

export default PermissionProvider;