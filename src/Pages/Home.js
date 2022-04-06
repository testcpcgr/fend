import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { authenticationService } from '../services/authentication.service';
import { backgroundColor, buttonColor, buttonTextColor } from "../Constants";
import ManagerAppbar from "../components/ManagerAppBar";
import { createStore, combineReducers } from 'redux';
import authorised from "../reduxReduncer/authorised";
import logo from "../Images/logo.png";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { activeDirectoryService } from '../services/authPopup';
import { useMsal } from "@azure/msal-react";
import Cookies from 'universal-cookie';

import {
    Button
  } from "@material-ui/core";

const HomePage = () => {
    const history = useNavigate();
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [currentUser, setUser] = useState(authenticationService.currentUserValue);
    var cookies =  new Cookies();
    const rootReducer = combineReducers({
        authorised
    });
    const store = createStore(rootReducer);
    const [drawers, setDrawer] = useState("");
    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authenticationService.currentUserValue.token,
              'oid': cookies.get('oid')
            },
            body: JSON.stringify({ 'objectId': authenticationService.currentUserValue.account.localAccountId }),
          };
          fetch(process.env.REACT_APP_SERVER_BASE_URL + 'user/getDefaultClient', requestOptions)
            .then((response) => response.json())
            .then(result => {
              if(result.message !== 'Unauthorized' && result.message !== "unable to fetch record")
              {      
                localStorage.setItem('ClientId', JSON.stringify(result.result[0].ClientId));
              }
            });
        if (isAuthenticated) {
            history('/');            
        }       
    }, [])
    
    const handleLogin = () => {
        activeDirectoryService.signIn(instance);
        if (currentUser !== null) {            
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