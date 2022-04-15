import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Provider } from 'react-redux';
import ManagerAppbar from "../../components/ManagerAppBar";
import { Typography } from "@material-ui/core";
import { backgroundColor} from "../../Constants";
import { createStore, combineReducers } from 'redux';
import authorised from "../../reduxReduncer/authorised";


function App() {
  const [data,setData] = useState([]);
  const [drawers, setDrawer] = useState("");
  const rootReducer = combineReducers({
    authorised
});
const store = createStore(rootReducer);
  useEffect(() => {
    const cookies = new Cookies();
    fetch("https://data.cms.gov/data-api/v1/dataset/d6d3de93-0579-408a-bcfe-c319f04069e7/data?keyword=Chronic&offset=0", 
    {
      method: "GET",
      headers: {
          "accept": "application/json"
      }
    })
      .then((response) => 
          response.json()       
      )
      .then((response) => {
          console.log(response);  
          setData(response);
          fetch(
            process.env.REACT_APP_SERVER_BASE_URL + 'cmsapi/DMEServiceDataStorage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('currentUser'))?.token,
                'oid': cookies.get('oid')
            },
            body: JSON.stringify(response)
        })
        .then((response) => 
            response.json()       
          )
          .then((response) => {
            if(response.success)
            {
              alert("data fetch completed: "+response.message);
            }
            else{
              alert("unable to store record : "+ response.message);
            }
          })
          

      })
}, [])
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
                
            </div>
        </div>
    </Panel>
</div>
  );
}

export default App;