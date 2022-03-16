import React,{useState} from "react";
import { backgroundColor, buttonColor, buttonTextColor } from "../../Constants";
import ManagerAppbar from "../../components/ManagerAppBar";
import { createStore, combineReducers } from 'redux';
import { AppBar, Typography } from "@material-ui/core";
import authorised from "../../reduxReduncer/authorised";
import { Provider } from 'react-redux';

function DMDashboardPage() {
    const [drawers, setDrawer] = useState("");
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
                <ManagerAppbar drawerOption={drawers} location="Home" />
            </Provider>

            <Panel value={1} index={1}>
                <div className="col-md-12">
                    <div className="emdeb-responsive">
                        <iframe
                            title="Driver Monitoring Live - Trip Analysis"
                            width="1200"
                            height="800"
                            src="https://app.powerbi.com/view?r=eyJrIjoiMDc4NDMyNzUtMTI0ZC00YzAyLTkzMDEtMzU5NTcxZmJiZDFlIiwidCI6IjdkODViMzVjLTg3MmUtNDA1NS1hZjkyLTgwZmI3YzlmOTRiNCIsImMiOjF9"
                            frameborder="0"
                            allowfullscreen="true"
                        ></iframe>
                    </div>
                </div>
            </Panel>
        </div>
    );
};

export default DMDashboardPage;