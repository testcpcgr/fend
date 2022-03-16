import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { getAll, getById } from '../services/user.services';
import { authenticationService } from '../services/authentication.service';
import { backgroundColor, buttonColor, buttonTextColor } from "../Constants";
import ManagerAppbar from "../components/ManagerAppBar";
import { createStore, combineReducers } from 'redux';
import authorised from "../reduxReduncer/authorised";

function HomePage() {
    const [currentUser, setUser] = useState(authenticationService.currentUserValue);
    const [userFromApi, setUserFromApi] = useState(null);
    const rootReducer = combineReducers({
        authorised
    });

    const store = createStore(rootReducer);
    const [drawers, setDrawer] = useState("");
    useEffect(() => {
        console.log(process.env.REACT_APP_SERVER_BASE_URL);
        getById(currentUser.id);
    }, [])
  

    return (
        <div style={{ minHeight: "100vh", backgroundImage: backgroundColor }}>
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
        </div>
    );

}

export default HomePage;