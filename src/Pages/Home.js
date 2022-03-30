import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
//import { getAll, getById } from '../services/user.services';
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

const HomePage = () => {
    const history = useNavigate();
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [currentUser, setUser] = useState(authenticationService.currentUserValue);
    const rootReducer = combineReducers({
        authorised
    });

    const store = createStore(rootReducer);
    const [drawers, setDrawer] = useState("");

    useEffect(() => {
        console.log(isAuthenticated);
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
                : <button
                    onClick={handleLogin}>
                    Sign In
                </button>
            }
        </div>
    );
}

export default HomePage;