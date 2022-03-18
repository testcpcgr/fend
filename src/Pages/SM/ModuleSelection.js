import { authenticationService } from '../../services/authentication.service';
import { backgroundColor, buttonColor, buttonTextColor } from "../../Constants";
import ManagerAppbar from "../../components/ManagerAppBar";
import authorised from "../../reduxReduncer/authorised";
import React from "react";
import { Link } from "react-router-dom";
import { createStore, combineReducers } from 'redux';
import { AppBar, Typography } from "@material-ui/core";

import { Provider } from 'react-redux';

class ModuleSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modulesList: [{ Id: 0, ModuleName: " --- Select a State ---" }],
            selectedModuleName: "",
            hasModuleSelected: false,
            fileTypeList: [{}],
            selectedFileType: [],
            token: authenticationService.currentUserValue.token,
            email: 'jack@gamil.com',
            drawers: ""
        };
    }

    componentDidMount() {
        fetch(
            process.env.REACT_APP_SERVER_BASE_URL + "getModules", {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((response) => {
                const newList = this.state.modulesList.concat(response.modules);
                this.setState({
                    modulesList: newList
                });
            });
    }

    submitSelection = (event) => {
        console.log(event);
        this.setState({
            selectedModuleName: event.name
        });
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'ModuleId': event.value, 'auth': this.state.token, 'email': this.state.email }),
        };
        fetch(
            process.env.REACT_APP_SERVER_BASE_URL + 'getFileTypesByModule',
            requestOptions
        )
            .then((response) => response.json())
            .then((response) => {
                if (response.success == true) {
                    this.setState({
                        hasModuleSelected: true
                    });
                    this.setState({
                        fileTypeList: response.filetypes
                    });
                } else {
                    alert('some error occurred try again');
                }
            })
            .catch((error) => {
                alert('server error occured : ' + error);
            });
    }

    handleOnChange = (event) => {
        const checked = event.target.checked;
        if (checked) {
            const newTypeList = this.state.selectedFileType.concat(event.target.value);
            this.setState({
                selectedFileType: newTypeList
            });
        }
        else {
            const newList = this.state.selectedFileType.filter((item) => item !== event.target.value);
            this.setState({
                selectedFileType: newList
            });
        }
    }

    render() {
        const { hasModuleSelected } = this.state;
        const { selectedModuleName } = this.state;
        const hasAnyFileSelected = this.state.selectedFileType.length;
       
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
                    <ManagerAppbar drawerOption={this.state.drawers} location="Home" />
                </Provider>
                <Panel value={1} index={1}>
                    <div className="col-md-12">
                        <div className="emdeb-responsive">
                            <select onChange={e => this.submitSelection(e.target)}>
                                {this.state.modulesList.map(module => (
                                    <option key={module.Id} name={module.ModuleName} value={module.Id} >{module.ModuleName}</option>
                                ))}
                            </ select>
                            {hasModuleSelected == true ?
                                <div className="App">
                                    <h3>{selectedModuleName} module included following files</h3>
                                    <ul className="toppings-list">
                                        {this.state.fileTypeList.map(fileType => {
                                            return (
                                                <li key={fileType.Id}>
                                                    <div >
                                                        <div >
                                                            <input
                                                                type="checkbox"
                                                                id={'custom-checkbox-${Id}'}
                                                                name={fileType.FileName}
                                                                value={fileType.Id}
                                                                onChange={e => this.handleOnChange(e)}
                                                            />
                                                            <label htmlFor={fileType.Id}>{fileType.FileName}</label>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    {
                                        hasAnyFileSelected > 0 ?
                                            <Link to={'/FileUpload'} state={{ filetypes: this.state.selectedFileType }}>
                                                Next
                                            </Link>
                                            :
                                            <></>
                                    }
                                </div>
                                :
                                <></>
                            }
                        </div>
                    </div>
                </Panel>
            </div>
        );
    };
}

export default ModuleSelection;