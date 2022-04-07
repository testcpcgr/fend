import { authenticationService } from '../../services/authentication.service';
import { backgroundColor, buttonColor, buttonTextColor } from "../../Constants";
import ManagerAppbar from "../../components/ManagerAppBar";
import authorised from "../../reduxReduncer/authorised";
import React from "react";
import { Link } from "react-router-dom";
import { createStore, combineReducers } from 'redux';
import { AppBar, Typography } from "@material-ui/core";
import Cookies from 'universal-cookie';
import { Provider } from 'react-redux';
var cookies = null;

class ModuleSelection extends React.Component {
    constructor(props) {
        super(props);
        cookies = new Cookies();
        this.state = {
            modulesList: [{ Id: 0, ModuleName: " --- Select a State ---" }],
            selectedModuleName: "",
            selectedModuleId: 0,
            hasModuleSelected: false,
            fileTypeList: [{}],
            selectedFileType: [],
            token: JSON.parse(localStorage.getItem('currentUser'))?.token,
            objectId: JSON.parse(localStorage.getItem('currentUser'))?.account.localAccountId,
            drawers: "",
            responseStatusCode: 0,
            error:"",
            boxchecked: []
        };
    }

    componentDidMount() {
        fetch(
            process.env.REACT_APP_SERVER_BASE_URL + "storage/getModules", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token,
                'oid': cookies.get('oid')
            }
        })
            .then((response) => response.json())
            .then((response) => {                
                if (response.message !== "Unauthorized") {
                    const newList = this.state.modulesList.concat(response.modules);
                    this.setState({
                        modulesList: newList
                    });
                }
                else{
                    this.setState({
                        error:response.message
                    });
                }                
            });
    }

    submitSelection = (event) => {
        this.setState({
            selectedModuleName: event.name,
            selectedModuleId: event.value
        });
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token,
                'oid': cookies.get('oid')
            },
            body: JSON.stringify({ 'ModuleId': event.value, 'objectId': this.state.objectId }),
        };
        fetch(
            process.env.REACT_APP_SERVER_BASE_URL + 'storage/getFileTypesByModule',
            requestOptions
        )
            .then((response) =>  response.json()
            )
            .then((response) => {               
                if (response.message !== "Unauthorized") {
                    this.setState({
                        hasModuleSelected: true
                    });
                    this.setState({
                        fileTypeList: response.filetypes
                    });
                } else {
                    alert('some error occurred try again: '+response.message);
                    this.setState({
                        error:response.message
                    });
                }
            })
            .catch((error) => {
                alert('server error occured : ' + error);
            });
    }

    handleOnChange = (event) => {        
        const { checked } = event.target;
        
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
        this.state.boxchecked[event.target.value] = checked;        
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
                        <h3>{this.state.error}</h3>
                            <select name="moduleList" onChange={e => this.submitSelection(e.target)} value={this.state.selectedModuleId}>
                                {this.state.modulesList.map(module => (
                                    <option key={module.Id} name={module.ModuleName} value={module.Id} >{module.ModuleName}</option>
                                ))}
                            </ select>
                            {hasModuleSelected == true ?
                                <div>
                                    <h3>{selectedModuleName} module included following files</h3>
                                    {this.state.fileTypeList.map((fileType, index) => {
                                        return (
                                            <div key={fileType.Id}>
                                                <input style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    marginLeft: "0%",
                                                }}
                                                    type="checkbox"
                                                    id={`custom-checkbox-${index}`}
                                                    name={fileType.FileName}
                                                    value={fileType.Id}
                                                    onChange={this.handleOnChange}
                                                    checked={ this.state.boxchecked[fileType.Id]}
                                                />
                                                <label htmlFor={`custom-checkbox-${index}`}>{fileType.FileName}</label>
                                            </div>
                                        );
                                    })}
                                    {
                                        hasAnyFileSelected > 0 ?
                                            <Link to={'/SM/FileUpload'} state={{ filetypes: this.state.selectedFileType }}>
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