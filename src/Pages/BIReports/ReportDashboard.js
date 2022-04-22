import authorised from "../../reduxReduncer/authorised";
import { backgroundColor } from "../../Constants";
import ManagerAppbar from "../../components/ManagerAppBar";
import IFrame from "../../components/IFrame";
import { authenticationService } from '../../services/authentication.service';
import React, { useState, useEffect } from "react";
import { createStore, combineReducers } from 'redux';
import { Typography } from "@material-ui/core";
import { Provider } from 'react-redux';
import Cookies from 'universal-cookie';
import { useLocation } from "react-router-dom";

function DMDashboardPage() {
    let location = useLocation();
   
    const drawers = "";
    //var [reportType, setReportType] = useState("");
    const [reportTypeIframeLink, setreportTypeIframeLink] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
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
        const cookies = new Cookies();
        // if (location.state !== 'undefined') {
        //     setReportType(removeExtraSpace(location.state.ReportType));
        // }
        fetch(
            process.env.REACT_APP_SERVER_BASE_URL + 'powerbi/getPowerBIReport', {
            method: 'POST',
            body: JSON.stringify({ ModuleId: 2, ClientId: authenticationService.clientId  }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authenticationService.currentUserValue.token,
                'oid': cookies.get('oid')
            }
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.message !== 'Unauthorized' && response.message !== 'unable to fetch record') {
                    const selectedType = response.data.filter(row =>
                        removeExtraSpace(row.Description) == removeExtraSpace(location.state.ReportType)
                    );
                    if (selectedType.length > 0) {
                        setreportTypeIframeLink(selectedType[0].Iframe);
                    }
                }
                else {
                    setErrorMessage(response.message);
                    alert('some error occurred try again');
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
                    <h3>{errorMessage}</h3>
                    <div key="1" className="emdeb-responsive">
                        <IFrame src={reportTypeIframeLink} height="800" width="1200" frameborder="0" title="WIP" allowfullscreen="true"></IFrame>
                    </div>
                </div>
            </Panel>
        </div>
    );
};

export default DMDashboardPage;