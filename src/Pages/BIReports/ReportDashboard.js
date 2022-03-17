import React, { useState, useEffect } from "react";
import { backgroundColor, buttonColor, buttonTextColor } from "../../Constants";
import ManagerAppbar from "../../components/ManagerAppBar";
import IFrame from "../../components/IFrame";
import { createStore, combineReducers } from 'redux';
import { AppBar, Typography } from "@material-ui/core";
import authorised from "../../reduxReduncer/authorised";
import { Provider } from 'react-redux';
import { authenticationService } from '../../services/authentication.service';

function DMDashboardPage() {
    const [drawers, setDrawer] = useState("");
    const [reportTypeList, setReportTypeList] = useState([{FileName: "Select report type", Id: 0,
    Iframe: ""
    ,IsRequired: false
    ,ModuleId: 0}]);
    const [reportTypeIframeLink, setreportTypeIframeLink] = useState([]);
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
    useEffect(() => {
       
        fetch(
            process.env.REACT_APP_SERVER_BASE_URL + 'wipsam/getWipsam', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '  + authenticationService.currentUserValue.token
            }
        })
            .then((response) => response.json())
            .then((response) => {             
                let newTypeList = reportTypeList.concat(response.data);
                setReportTypeList(newTypeList);
            });
    }, []);


    const onReportTypeSelect = (event) => {
        const selectedType = reportTypeList.filter(row =>
            row.Id == event.value
        );
        if (selectedType.length > 0) {
            setreportTypeIframeLink(selectedType[0].Iframe);            
        }
    }
    return (
        <div style={{ minHeight: "100vh", backgroundImage: backgroundColor }}>
            <Provider store={store}>
                <ManagerAppbar drawerOption={drawers} location="Home" />
            </Provider>
            <select onChange={e => onReportTypeSelect(e.target)}>
                {reportTypeList.map(reportType => (
                    <option key={reportType.Id} name={reportType.FileName} value={reportType.Id} >{reportType.FileName}</option>
                ))}
            </ select>

            <Panel value={1} index={1}>
                <div className="col-md-12">
                    <div key="1" className="emdeb-responsive">
                        <IFrame src={reportTypeIframeLink} height="800" width="1200" frameborder="0" title="WIP" allowfullscreen="true"></IFrame>
                    </div>
                </div>
            </Panel>
        </div>
    );
};

export default DMDashboardPage;