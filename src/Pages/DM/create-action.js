import React from "react";
import { backgroundColor, buttonColor, buttonTextColor } from "../../Constants";
import ManagerAppbar from "../../components/ManagerAppBar";
import { createStore, combineReducers } from 'redux';
import { AppBar, Typography } from "@material-ui/core";
import authorised from "../../reduxReduncer/authorised";
import { Provider } from 'react-redux';
import { authenticationService } from '../../services/authentication.service';
import Cookies from 'universal-cookie';
var cookies = null;

class MyForm extends React.Component {
    constructor(props) {
        super(props);
        cookies = new Cookies();
        this.state = {
            disposition_type_id: 0,
            response_type_id: null,
            note: "",
            token: authenticationService.currentUserValue.token,
            email: authenticationService.currentUserValue.account.username,
            assignee: 0,
            stakeholdersList: [
                { Id: 0, name: " --- Select a State ---", User_Type: "" },
            ],
            dispositionList: [{ Id: 0, Description: " --- Select a State ---" }],
            drawers: "",
            error: ""
        };
    }

    componentDidMount() {

        fetch(process.env.REACT_APP_SERVER_BASE_URL + "drivermonitoring/GetStakeholders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + this.state.token,
                'oid': cookies.get('oid')
            },
            body: JSON.stringify({
                email: this.state.email,
                token: this.state.token,
            })
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.message !== "stakeholder record not found") {
                    const newList = this.state.stakeholdersList.concat(response.result);
                    this.setState({
                        stakeholdersList: newList,
                    });
                }
                else{
                    this.setState({
                        error:response.message
                    });
                } 
            });

        fetch(process.env.REACT_APP_SERVER_BASE_URL + "drivermonitoring/GetDisposition", {
            method: "Get",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + this.state.token,
                'oid': cookies.get('oid')
            }
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.message !== "Unauthorized") {
                    const newList = this.state.dispositionList.concat(response.result);
                    this.setState({
                        dispositionList: newList,
                    });
                }
                else{
                    
                    this.setState({
                        error:response.message
                    });
                } 
            });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (event) => {       
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + this.state.token,
                'oid': cookies.get('oid')
            },
            body: JSON.stringify(this.state),
        };
        fetch(
            process.env.REACT_APP_SERVER_BASE_URL + "drivermonitoring/CreateAction",
            requestOptions
        )
        .then((response) => response.json())
        .then(function (response) {
            return response;
        });

        event.preventDefault();
    };

    render() {
        var rootReducer = combineReducers({
            authorised
        });

        var store = createStore(rootReducer);
        var Panel = (props) => {
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
                <Panel value={1} index={1} style={{
                    display: "flex",
                    justifyContent: "center",
                }}>
                      
                    <form
                        onSubmit={this.handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            width: "50%",
                            height: "80%",
                            border: "1px solid black",
                            padding: "10px",
                        }}
                    >
                        <h3 >{this.state.error}</h3>
                        <label>Select Stakeholder type:</label>
                        <select name="assignee" onChange={(e) => this.handleChange(e)} value={(e) => e.target.value}>
                            {this.state.stakeholdersList.map((stakeholder) => (
                                <option
                                    key={stakeholder.Id}
                                    name="assignee"
                                    value={stakeholder.Id}
                                >
                                    {stakeholder.name}
                                </option>
                            ))}
                        </select>
                        <br />

                        <label>Select disposition type:</label>
                        <select
                            name="disposition_type_id"
                            onChange={(e) => this.handleChange(e)}
                            value={(e) => e.target.value}
                        >
                            {this.state.dispositionList.map((disposition) => (
                                <option
                                    key={disposition.Id}
                                    name="disposition_type_id"
                                    value={disposition.Id}
                                >
                                    {disposition.Description}
                                </option>
                            ))}
                        </select>
                        <br />
                        <label>
                            Enter note:
                            <input
                                type="text"
                                value={this.state.note}
                                name="note"
                                onChange={this.handleChange}
                            />
                        </label>

                        <input
                            type="submit"
                            value="Submit"
                            style={{
                                backgroundColor: "#0E7A57",
                                // width: "70px",
                                color: "white",
                                borderRadius: "5px",
                                padding: "8px",
                                marginTop: "10px",
                                marginLeft: "45%",
                                marginRight: "45%",
                                border: "none",
                            }}
                        />
                    </form>
                </Panel>
            </div>
        );
    }
}

export default MyForm;
