import React, { useState } from "react";
import { backgroundColor, buttonColor, buttonTextColor } from "../../Constants";
import ManagerAppbar from "../../components/ManagerAppBar";
import { createStore, combineReducers } from 'redux';
import { AppBar, Typography } from "@material-ui/core";
import authorised from "../../reduxReduncer/authorised";
import { Provider } from 'react-redux';
import { authenticationService } from '../../services/authentication.service';

const ActionNote = (props) => {
    const [action_id, setActionId] = useState();
    const [note, setNote] = useState();
    const [drawers, setDrawer] = useState("");
    const handleChange = (event) => {
        setActionId(props.actionid);
        setNote(event.target.value);
    };

    const handleSubmit = (event) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authenticationService.currentUserValue.token
            },
            body: JSON.stringify({ 'action_id': action_id, 'note': note, email: 'jack@gmail.com', token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJpYXQiOjE2NDc0MTk5NDgsImV4cCI6MTY0NzQyNzE0OH0.qxz8U-56frZoGqnovEaiHz-ghxv4qPm3qzTWewTxelc'})
        };
        fetch(process.env.REACT_APP_SERVER_BASE_URL + 'drivermonitoring/CreateActionNotes', requestOptions)
            .then(function (response) {
                response.json();
            }).then((result) => {
                window.location.href = "/view-actions";
            });
        event.preventDefault();
    };

    const rootReducer = combineReducers({
        authorised
    });

    const store = createStore(rootReducer);
    const Panel = (props) => {
        return (
            <div hidden={props.value !== props.index}>
                <Typography>{props.children}</Typography>
            </div>
        );
    };

    return (
       
        <div style={{ minHeight: "100vh", backgroundImage: backgroundColor }}>
            <Provider store={store}>
                <ManagerAppbar drawerOption={drawers} location="Home" />
            </Provider>
            <Panel value={1} index={1}>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="action_id" value='0'></input>
                    <input type="text" name="note" onChange={handleChange}></input>
                    <input type="submit" value="Submit" />
                </form>
            </Panel>
        </div>
    );
};

export default ActionNote;