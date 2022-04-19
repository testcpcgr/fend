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
  const [size, setSize] = useState(5000);
  const rootReducer = combineReducers({
    authorised
  });
  const store = createStore(rootReducer);
  
  useEffect( async () => {
    const cookies = new Cookies();
    var rowsReturned=0;
    var offset = 0;
    var fetchingFinished = 0;
    do {
        console.log(size, offset);
        await fetch("https://data.cms.gov/data-api/v1/dataset/d6d3de93-0579-408a-bcfe-c319f04069e7/data?size="+size+"&offset="+offset, 
        {
          method: "GET",
          headers: {
              "accept": "application/json"
          }
        })
        .then(async (response) => 
          response.json()
        )
        .then(async (response) => {           
            rowsReturned = response.length;
            if(rowsReturned < size)
              fetchingFinished = 1;
           
            // if(response.length > 0 && offset === 0)
            // {
            //   await fetch(
            //       process.env.REACT_APP_SERVER_BASE_URL + 'cmsapi/DmeDeleteExistingData', {
            //       method: 'POST',            
            //       headers: {
            //           'Content-Type': 'application/json',
            //           'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('currentUser'))?.token,
            //           'oid': cookies.get('oid')
            //       },
            //       body: JSON.stringify({tableName: 'DME_Service'})
            //   })
            // }

            await fetch(
                process.env.REACT_APP_SERVER_BASE_URL + 'cmsapi/DMEServiceDataStorage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('currentUser'))?.token,
                    'oid': cookies.get('oid')
                },
                body: JSON.stringify(response)
            })
            .then(async (response) => 
                response.json()       
            )
            .then(async (response) => {
                if(response.success)
                {
                  offset = (offset+5000);
                }
                else{
                  return;
                  alert("unable to store record : "+ response.message);                  
                }
          })
        })
    } while (!fetchingFinished)
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