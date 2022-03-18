import authorised from "../../reduxReduncer/authorised";
import { backgroundColor, buttonColor, buttonTextColor } from "../../Constants";
import ManagerAppbar from "../../components/ManagerAppBar";
import IFrame from "../../components/IFrame";
import { authenticationService } from '../../services/authentication.service';
import React, { useState, useEffect } from "react";
import { createStore, combineReducers } from 'redux';
import { AppBar, Typography } from "@material-ui/core";
import { Provider } from 'react-redux';

import { useLocation } from "react-router-dom";

function DMDashboardPage() {
    let location = useLocation();
    const [drawers, setDrawer] = useState("");
    var [reportType, setReportType] = useState("");
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
    const removeExtraSpace = (s) => s.trim().split(/ +/).join(' ');
    useEffect(() => {
        if (location.state !== 'undefined') {
            setReportType(removeExtraSpace(location.state.ReportType));
        }
        fetch(
            process.env.REACT_APP_SERVER_BASE_URL + 'wipsam/getPowerBIReport', {
            method: 'POST',
            body: JSON.stringify({ ModuleId: 2 }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authenticationService.currentUserValue.token
            }
        })
            .then((response) => response.json())
            .then((response) => {
                const selectedType = response.data.filter(row =>
                    removeExtraSpace(row.FileName) == removeExtraSpace(location.state.ReportType)
                );
                if (selectedType.length > 0) {
                    setreportTypeIframeLink(selectedType[0].Iframe);
                }
            });
    }, [location.state.ReportType]);
    return (
        <div style={{ minHeight: "100vh", backgroundImage: backgroundColor }}>
            <Provider store={store}>
                <ManagerAppbar drawerOption={drawers} location="Home" />
            </Provider>
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