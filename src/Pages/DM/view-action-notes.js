import React from "react";
import ActionNote from "./action-note.js";
import { backgroundColor, buttonColor, buttonTextColor } from "../../Constants";
import ManagerAppbar from "../../components/ManagerAppBar";
import { createStore, combineReducers } from 'redux';
import { AppBar, Typography } from "@material-ui/core";
import authorised from "../../reduxReduncer/authorised";
import { Provider } from 'react-redux';
import { authenticationService } from '../../services/authentication.service';

class ViewActionNotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionNotesList: [],
            actionList: [],
            action_id: props.actionid,
            showCommentForm: false,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJpYXQiOjE2NDc0MTk5NDgsImV4cCI6MTY0NzQyNzE0OH0.qxz8U-56frZoGqnovEaiHz-ghxv4qPm3qzTWewTxelc',
            email: 'jack@gmail.com',
            note: "",
            role: 1,
            drawers:""
        };
    }

    componentDidMount() {
        var isuserassignee = false;
        if (this.state.role === "1") {
            isuserassignee = false;
        } else {
            isuserassignee = true;
        }

        fetch(process.env.REACT_APP_SERVER_BASE_URL + "drivermonitoring/GetActionNoteByEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + authenticationService.currentUserValue.token
            },
            body: JSON.stringify({
                action_id: this.state.action_id,
                email: this.state.email,
                token: this.state.token,
                isassignee: isuserassignee,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    actionNotesList: response.actions,
                });
            });
    }
    render() {
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
            // <div style={{ minHeight: "100vh", backgroundImage: backgroundColor }}>
                
                // <Panel value={1} index={1}>
                //     {
                        <div style={{ border: "1px solid" }}>
                            {this.state.actionNotesList.map((note) => (
                                <p>{note.comment}</p>
                            ))}
                        </div>
                //     }
                // </Panel>
            // </div>
        );
    }
}
export default ViewActionNotes;
