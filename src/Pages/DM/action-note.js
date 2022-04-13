import React, { useState } from "react";
// import { combineReducers } from 'redux';
import { Typography } from "@material-ui/core";
// import authorised from "../../reduxReduncer/authorised";
import Cookies from 'universal-cookie';

const ActionNote = (props) => {
    const [action_id, setActionId] = useState();
    const [note, setNote] = useState();
    const token= JSON.parse(localStorage.getItem('currentUser'))?.token;
    const objectId = JSON.parse(localStorage.getItem('currentUser'))?.account.localAccountId;
    const cookies = new Cookies();
    const handleChange = (event) => {
        setActionId(props.actionid);
        setNote(event.target.value);
    };

    const handleSubmit = (event) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'oid': cookies.get('oid')
            },
            body: JSON.stringify({ 'action_id': action_id, 'note': note, objectId: objectId})
        };
        fetch(process.env.REACT_APP_SERVER_BASE_URL + 'drivermonitoring/CreateActionNotes', requestOptions)
            .then(function (response) {
                response.json();
            }).then((result) => {
                window.location.href = "/view-actions";
            });
        event.preventDefault();
    };

    // const rootReducer = combineReducers({
    //     authorised
    // });

    const Panel = (props) => {
        return (
            <div hidden={props.value !== props.index}>
                <Typography>{props.children}</Typography>
            </div>
        );
    };

    return (
            <Panel value={1} index={1}>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="action_id" value='0'></input>
                    <input type="text" name="note" value={note} onChange={handleChange}></input>
                    <input type="submit" value="Submit" />
                </form>
            </Panel>
       
    );
};

export default ActionNote;