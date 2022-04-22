import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { authenticationService } from '../services/authentication.service';
import { backgroundColor, buttonColor, buttonTextColor } from "../Constants";
import ManagerAppbar from "../components/ManagerAppBar";
import { createStore, combineReducers } from 'redux';
import authorised from "../reduxReduncer/authorised";
import logo from "../Images/logo.png";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate, useLocation } from "react-router-dom";
import { activeDirectoryService } from '../services/authPopup';
import { useMsal } from "@azure/msal-react";
import Cookies from 'universal-cookie';

import {
    Button
  } from "@material-ui/core";

const HomePage = (props) => {
    var cookies =  new Cookies();
   
    const history = useNavigate();
    const { instance } = useMsal();
    const location = useLocation();
    const isAuthenticated = useIsAuthenticated();
    const [currentUser, setUser] = useState(authenticationService.currentUserValue);
    const [drawers, setDrawer] = useState("");
    const rootReducer = combineReducers({
        authorised
    });
    const store = createStore(rootReducer);
    const oid =  cookies.get('oid');
    useEffect(() => {
        if (isAuthenticated) {            
            history('/');            
        }       
    }, [])
    
    const handleLogin = () => {
        activeDirectoryService.signIn(instance);
        if (currentUser !== null) {
            var requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token,
                  'oid': oid
                },
                body: JSON.stringify({ 'objectId': JSON.parse(localStorage.getItem('currentUser'))?.account.localAccountId, 'clientId': authenticationService.clientId }),
              };
          
              fetch(process.env.REACT_APP_SERVER_BASE_URL + 'user/getUserPermissionByObjectId', requestOptions)
                .then((response) => response.json())
                .then(result => {
                  if(result.message !== 'Unauthorized' && result.message !== "unable to fetch record")
                  {
                    localStorage.setItem('UserRole', JSON.stringify({ permissionLevelId: result.result[0].PermissionLeveId }));
                  }
                });
            history("/");
        }
    };
    
  
    return (
        <div style={{ minHeight: "100vh", backgroundImage: backgroundColor }}>
            {isAuthenticated ? <>
                <Provider store={store}>
                    <ManagerAppbar drawerOption={drawers} location="Home" />
                </Provider>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p style={{ fontSize: 14, marginLeft: -50 }} autoCapitalize>
                        Click on the left Navigation bar to continue
                    </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                    <img
                        src={logo}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            // paddingLeft: 50,
                        }}
                        alt="CPCGR LOGO"
                    />
                </div>                
            </>
                : 
                <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                style={{ alignSelf: "center" }}
              >
                Sign In
              </Button>
            }
        </div>
    );
}

export default HomePage;