import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Provider } from 'react-redux';
import ManagerAppbar from "../../components/ManagerAppBar";
import { Typography } from "@material-ui/core";
import { backgroundColor} from "../../Constants";
import { createStore, combineReducers } from 'redux';
import {authorised} from "../../reduxReduncer/authorised";

function App() {

  const size = 5000;
  const [rowInserted, setRowInserted] = useState(0);
  const [fetchingFinishedLabel, setFetchingFinishedLabel] = useState("");
  const rootReducer = combineReducers({
    authorised
});
  const store = createStore(rootReducer);

  useEffect(() => {
   
    
    async function startProcess(){
      const cookies = new Cookies();
     
      await fetch(
        process.env.REACT_APP_SERVER_BASE_URL + 'cmsapi/DmeDeleteExistingData', {
        method: 'POST',            
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('currentUser'))?.token,
            'oid': cookies.get('oid')
        },
        body: JSON.stringify({tableName: 'DME_Geography'})
      })
      .then(async ()=>{
        //let rowsReturned=0;
        
       // let fetchingFinished = 0;
        do {
          let offset = parseInt(localStorage.getItem('offset') ?? 0);
          console.log(size, offset);
          await fetch("https://data.cms.gov/data-api/v1/dataset/bcd4a866-c07f-4ec3-a780-1fa7f0399ab9/data?size="+size+"&offset="+offset, 
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
            setFetchingFinishedLabel("");
           // rowsReturned = response.length;
            if(response.length < size)
              //fetchingFinished = 1;        
              localStorage.setItem('fetchingFinished', 1);
            
            await fetch(
                  process.env.REACT_APP_SERVER_BASE_URL + 'cmsapi/DMEGeographyDataStorage', {
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
                  setRowInserted(offset);
                  localStorage.setItem('offset', offset);
                }
              else{
                //fetchingFinished = 1;
                localStorage.setItem('fetchingFinished', 1);
                alert("unable to store record : "+ response.message);
              }
            })
          })
        } while (!parseInt(localStorage.getItem('fetchingFinished')))
        if(parseInt(localStorage.getItem('fetchingFinished'))){
          setFetchingFinishedLabel("Storing process finished. You can leave this page.");
        }
      });
    }
    
    var proceed = window.confirm("Are you sure you want to start fetch and store process? It might take significant time to pull all records and store into database");
    if (proceed) {
      startProcess();
    } else {
      alert("Process wasn't initiated");
    }
    localStorage.setItem('fetchingFinished', 0);
    localStorage.setItem('offset', 0);
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
                <ManagerAppbar drawerOption="" location="Home" />
            </Provider>

            <Panel value={1} index={1}>
                <div className="col-md-12">
                   
                   
                    <div className="emdeb-responsive">
                      <h1>Total rows stored in db: {rowInserted}</h1>
                      <h1>{fetchingFinishedLabel}</h1>
                      <h2>Warning: Please do not close or refresh page unless finish message appear</h2>
                    </div>
                </div>
            </Panel>
        </div>
  );
}

export default App;