import React from "react";
import { backgroundColor } from "../../Constants";
import ManagerAppbar from "../../components/ManagerAppBar";
import { createStore, combineReducers } from 'redux';
import { Typography } from "@material-ui/core";
import authorised from "../../reduxReduncer/authorised";
import { Provider } from 'react-redux';
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
            token: JSON.parse(localStorage.getItem('currentUser'))?.token,
            objectId: JSON.parse(localStorage.getItem('currentUser'))?.account.localAccountId,
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
                objectId: this.state.objectId
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

    handleSingleChange = e => {
        this.setState({
          note: e.target.value
        });
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
            if(response.success === true)
            {
                alert(response.message);
                window.location.href = "/DM/DMActionViewPage";
            }
            else{
                alert(response.message);
            }
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
                        <select name="assignee" onChange={(e) => this.handleChange(e)} value={this.state.assignee}>
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
                            value={this.state.disposition_type_id}
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
                                name="note"
                                type="text"                                
                                onBlur={this.handleSingleChange}                              
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
