import React from 'react'
import CreateActionNote from './action-note.js';
import ActionChats from './view-action-notes.js';
import { backgroundColor, buttonColor, buttonTextColor } from "../../Constants";
import ManagerAppbar from "../../components/ManagerAppBar";
import { createStore, combineReducers } from 'redux';
import { AppBar, Typography } from "@material-ui/core";
import authorised from "../../reduxReduncer/authorised";
import { Provider } from 'react-redux';
import { authenticationService } from '../../services/authentication.service';
import Cookies from 'universal-cookie';
var cookies = null;

class ViewActions extends React.Component {
    constructor(props) {
        super(props);
        cookies = new Cookies();
        this.state = {
            actionNotesList: [],
            actionList: [],
            action_id: 0,
            showCommentForm: false,
            showChat: false,
            token: authenticationService.currentUserValue.token,
            objectId: authenticationService.currentUserValue.account.localAccountId,
            note: '',
            role: authenticationService.currentUserValue.role,
            responseTypeList: [{ Id: 0, Description: '---Select from list---' }],
            StatusList: [{ Id: 0, Status: '---Select from list---' }],
            drawers: "",          
            error: ""
        };
    }

    componentDidMount() {
        var isuserassignee = false;
        if (this.state.role === 'Admin') {
            isuserassignee = false;
        }
        else {
            isuserassignee = false;
        }

        fetch(
            process.env.REACT_APP_SERVER_BASE_URL + "drivermonitoring/GetActionByEmail", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authenticationService.currentUserValue.token,
                'oid': cookies.get('oid')
            },
            body: JSON.stringify({ objectId: this.state.objectId, isassignee: isuserassignee })
        })
            .then((response) =>
                response.json()
            )
            .then((response) => {
                if (response.message !== "Unauthorized") {
                    const actions = [];
                    const map = new Map();
                    for (const item of response.actions) {
                        if (!map.has(item.id)) {
                            map.set(item.id, true);    // set any value to Map
                            actions.push({
                                id: item.id,
                                createdat: item.createdat,
                                firstname: item.firstname,
                                disposition_type: item.disposition_type,
                                notes: item.notes,
                                Status: item.Status,
                                ResponseType: item.ResponseType
                            });
                        }
                    }
                    const actionNotes = [];
                    response.owner_action_note.forEach((notes) => {
                        actionNotes.push({ id: notes.action_id, comment: notes.comment });
                    });

                    response.assignee_action_note.forEach((notes) => {
                        actionNotes.push({ id: notes.action_id, comment: notes.comment });
                    });

                    this.setState({
                        actionList: actions
                    });
                    this.setState({
                        actionNotesList: actionNotes
                    });
                }
                else {
                    this.setState({
                        error: response.message
                    });
                }
            });
        if (isuserassignee) {
            fetch(
                process.env.REACT_APP_SERVER_BASE_URL + "drivermonitoring/GetResponseType", {
                method: 'Get',
                headers: {
                    'Authorization': 'Bearer ' + authenticationService.currentUserValue.token,
                    'oid': cookies.get('oid')
                },
            })
                .then((response) =>
                    response.json()
                )
                .then((response) => {
                    if (response.message !== "Unauthorized") {
                        const newList = this.state.responseTypeList.concat(response.result);
                        this.setState({
                            responseTypeList: newList
                        });
                    }
                    else {
                        this.setState({
                            error: response.message
                        });
                    }
                });
        }
        else {
            fetch(
                process.env.REACT_APP_SERVER_BASE_URL + "drivermonitoring/GetActionStatus", {
                method: 'Get',
                headers:
                {
                    'Authorization': 'Bearer ' + authenticationService.currentUserValue.token,
                    'oid': cookies.get('oid')
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.message !== "Unauthorized") {
                        const newList = this.state.StatusList.concat(response.result);
                        this.setState({
                            StatusList: newList
                        });
                    }
                    else {
                        this.setState({
                            error: response.message
                        });
                    }
                });
        }
    }

    addNotes = (actionId) => {
        this.setState({ showCommentForm: true, action_id: actionId });
    }

    openChat = (actionId) => {
        console.log(actionId);
        this.setState({ showChat: true, action_id: actionId });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = (event) => {
        const requestOptions = {
            method: 'POST',
            headers:
            {
                'Authorization': 'Bearer ' + authenticationService.currentUserValue.token,
                'oid': cookies.get('oid')
            },
            body: JSON.stringify({ 'action_id': this.state.action_id, 'note': this.state.note, objectId: this.state.objectId })
        };
        fetch(process.env.REACT_APP_SERVER_BASE_URL + 'drivermonitoring/CreateActionNotes', requestOptions)
            .then((response) => response.json())
            .then(function (response) {
                return response;
            });
        event.preventDefault();
    }

    submitResponseType = (event) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authenticationService.currentUserValue.token,
                'oid': cookies.get('oid')
            },
            body: JSON.stringify({ 'action_id': event.target.getAttribute("actionid"), 'response_type_id': event.target.value })
        };
        fetch(process.env.REACT_APP_SERVER_BASE_URL + 'drivermonitoring/UpdateActionResponseType', requestOptions)
            .then((response) => response.json())
            .then(function (response) {
                return response;
            });
        event.preventDefault();
    }

    updateActionStatus = (event) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authenticationService.currentUserValue.token,
                'oid': cookies.get('oid')
            },
            body: JSON.stringify({ 'action_id': event.target.getAttribute("actionid"), 'status_id': event.target.value })
        };
        fetch(process.env.REACT_APP_SERVER_BASE_URL + 'drivermonitoring/UpdateActionStatus', requestOptions)
            .then(function (response) {
                return response.json();
            });
        event.preventDefault();
    }
    render() {
        const { showCommentForm } = this.state;
        const { showChat } = this.state;
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
                    <ManagerAppbar drawerOption={this.drawers} location="Home" />
                </Provider>
                <Panel value={1} index={1}>
                    <h3>{this.state.error}</h3>
                    <h1>Driver monitoring: All monitoring actions</h1>
                    <table className='center'>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Dispostion Type</th>
                                <th>Note</th>
                                {
                                    this.state.role != 1 ?
                                        <th>Response Type</th>
                                        : <th>Status</th>}
                                <th>Response note</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.actionList.map(action => (
                                <tr key={action.Id}>
                                    <td >{action.createdat}</td>
                                    <td >{action.disposition_type}</td>
                                    <td >{action.notes}</td>
                                    {
                                        this.state.role != 1 ?
                                            <td >
                                                <select name='response_type_id' actionid={action.id} value={action.ResponseType} onChange={e => this.submitResponseType(e)}>
                                                    {this.state.responseTypeList.map(response => (
                                                        <option key={response.Id} name='response_type_id' value={response.Id} >{response.Description}</option>
                                                    ))}
                                                </ select>
                                            </td>
                                            : <td >
                                                <select name='status_id' actionid={action.id} value={action.Status} onChange={e => this.updateActionStatus(e)}>
                                                    {this.state.StatusList.map(status => (
                                                        <option key={status.Id} name='status_id' value={status.Id} >{status.Status}</option>
                                                    ))}
                                                </ select>
                                            </td>
                                    }
                                    <td>
                                        <button id={action.id}

                                            onClick={() => this.openChat(action.id)}
                                        >
                                            Open chat
                                        </button>
                                    </td>
                                    <td><button id={action.id}
                                        onClick={() => this.addNotes(action.id)}
                                    >
                                        Add comment
                                    </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {
                        showChat == true ?
                            <ActionChats actionid={this.state.action_id} role={this.state.role} />
                            :
                            <></>
                    }
                    {
                        showCommentForm == true ?
                            <CreateActionNote actionid={this.state.action_id} role={this.state.role} />
                            :
                            <></>
                    }
                </Panel>
            </div>
        );
    };
}

export default ViewActions;