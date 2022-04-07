import React from "react";
import ActionNote from "./action-note.js";
import { backgroundColor, buttonColor, buttonTextColor } from "../../Constants";
import ManagerAppbar from "../../components/ManagerAppBar";
import { createStore, combineReducers } from 'redux';
import { AppBar, Typography } from "@material-ui/core";
import authorised from "../../reduxReduncer/authorised";
import { Provider } from 'react-redux';
import { authenticationService } from '../../services/authentication.service';
import Cookies from 'universal-cookie';
var cookies = null;

class ViewActionNotes extends React.Component {
    constructor(props) {
        super(props);
        cookies = new Cookies();
        this.state = {
            actionNotesList: [],
            actionList: [],
            action_id: props.actionid,
            showCommentForm: false,           
            objectId: authenticationService.currentUserValue.account.localAccountId,
            note: "",
            role: 1,
            drawers: "",           
            error: ""
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
                'Authorization': 'Bearer ' + authenticationService.currentUserValue.token,
                'oid': cookies.get('oid')
            },
            body: JSON.stringify({
                action_id: this.state.action_id,
                objectId: this.state.objectId,
                isassignee: isuserassignee,
            }),
        })
            .then((response) => 
                response.json()
            )
            .then((response) => {
                if (response.message !== "Unauthorized") {
                    this.setState({
                        actionNotesList: response.actions,
                    });
                }
                else{
                    this.setState({
                        error:response.message
                    });
                }    
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
            <div style={{ border: "1px solid" }}>
                <h3>{this.state.error}</h3>
                {this.state.actionNotesList.map((note) => (
                    <p>{note.comment}</p>
                ))}
            </div>           
        );
    }
}
export default ViewActionNotes;
