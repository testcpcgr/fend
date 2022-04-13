import ManagerAppbar from "../../components/ManagerAppBar";
import IFrame from "../../components/IFrame";
import authorised from "../../reduxReduncer/authorised";
import React, { useState, useEffect } from "react";
import { backgroundColor } from "../../Constants";
import { createStore, combineReducers } from 'redux';
import { Typography } from "@material-ui/core";
import { Provider } from 'react-redux';
import { useLocation } from "react-router-dom";
import Cookies from 'universal-cookie';

function DMDashboardPage() {
    let location = useLocation();
    const drawers = "";
    // var [reportType, setReportType] = useState("");
    const [reportTypeIframeLink, setreportTypeIframeLink] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
   
   // const [objectId, setObjectId] = useState(JSON.parse(localStorage.getItem('currentUser'))?.account.localAccountId);
    const rootReducer = combineReducers({
        authorised
    });
    const store = createStore(rootReducer);
    const removeExtraSpace = (s) => s.trim().split(/ +/).join(' ');
   
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('currentUser'))?.token;
        const cookies = new Cookies();
        // if (location.state !== 'undefined') {
        //     setReportType(removeExtraSpace(location.state.ReportType));
        // }
        fetch(
            process.env.REACT_APP_SERVER_BASE_URL + 'wipsam/getPowerBIReport', {
            method: 'POST',
            body: JSON.stringify({ ModuleId: 1 }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'oid': cookies.get('oid')
            }
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.message !== 'Unauthorized') {
                    const selectedType = response.data.filter(row =>
                        removeExtraSpace(row.FileName).indexOf(removeExtraSpace(location.state.ReportType)) !== -1
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
                <ManagerAppbar drawerOption={drawers} location="Home" />
            </Provider>

            <Panel value={1} index={1}>
                <div className="col-md-12">
                    <h3 >{errorMessage}</h3>
                    <div className="emdeb-responsive">
                        <IFrame src={reportTypeIframeLink} height="800" width="1200" frameborder="0" title="WIP" allowfullscreen="true"></IFrame>
                    </div>
                </div>
            </Panel>
        </div>
    );
};

export default DMDashboardPage;