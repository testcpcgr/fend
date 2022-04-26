import './App.css';
import HomePage from "./Pages/Home";
import DMDashboardPage from "./Pages/DM/dashboard";
import DMActionViewPage from "./Pages/DM/view-actions";
import DMCreateActionPage from "./Pages/DM/create-action";
import BIReports from "./Pages/BIReports/ReportDashboard";
import PrivateRoute from './components/PrivateRoute';
import FileUpload from "./Pages/SM/FileUpload";
import ModuleSelection from "./Pages/SM/ModuleSelection";
import DMEGeographyApiStorage from "./Pages/CMSApi/DMEGeography";
import DMEServiceApiStorage from "./Pages/CMSApi/DMEService";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { ModuleName } from './helpers/enum/Module_Enum';
import { authenticationService } from './services/authentication.service';

function App() {

  var [permissionDetails, setPermissionDetails] = useState([]);
  useEffect( () => {
    async function getPermission(){
      const cookies = new Cookies();
      var requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token,
          'oid': cookies.get('oid')
        },
        body: JSON.stringify({ 'objectId': JSON.parse(localStorage.getItem('currentUser'))?.account.localAccountId, 'clientId': authenticationService.clientId }),
      };
      await fetch(process.env.REACT_APP_SERVER_BASE_URL + 'user/getUserPermissionByObjectId', requestOptions)
        .then((response) => response.json())
        .then(async result => {
          if(result.message !== 'Unauthorized' && result.message !== "unable to fetch record")
          {
            setPermissionDetails(result.result);
            localStorage.setItem('UserRole', JSON.stringify({ permissionLevelId: result.result[0].PermissionLeveId }));
          }
        });
    }
    getPermission()
  },[]);

  return (
    <Router>
      <div className="App">        
        <Routes>
          <Route element={<PrivateRoute permissionList={permissionDetails} module={ModuleName.SMUpload} permissionLevel="Write" />}>
            <Route path="/SM/FileUpload/" strict exact element={<FileUpload />} />
          </Route>
          <Route element={<PrivateRoute permissionList={permissionDetails}  module={ModuleName.SMUpload} permissionLevel="Write" />}>
            <Route path="/SM/ModuleSelection/" element={<ModuleSelection />} />
          </Route>
          <Route element={<PrivateRoute permissionList={permissionDetails}  module={ModuleName.DMDashboard} permissionLevel="Read" />}>
            <Route path='/DM/DMDashboardPage' element={<DMDashboardPage />} />
          </Route>
          <Route element={<PrivateRoute permissionList={permissionDetails}  module={ModuleName.DMAction} permissionLevel="Read" />}>
            <Route path='/DM/DMActionViewPage' element={<DMActionViewPage />} />
          </Route>
          <Route element={<PrivateRoute permissionList={permissionDetails}  module={ModuleName.DMAction} permissionLevel="Write" />}>
            <Route path='/DM/DMCreateActionPage' element={<DMCreateActionPage />} />
          </Route>
          <Route path='/Reports/ReportDashboard/:ReportType' search='?ReportType=Wipsam' element={<PrivateRoute permissionList={permissionDetails}  module={ModuleName.ReportWipsam} permissionLevel="Read" />}>
            <Route path='/Reports/ReportDashboard/:ReportType' search='?ReportType=Wipsam' element={<BIReports />} />
          </Route>
          <Route path='/Reports/ReportDashboard/' search='?ReportType=WipsamManagement' element={<PrivateRoute permissionList={permissionDetails}  module={ModuleName.ReportWipsamManagement} permissionLevel="Read" />}>
            <Route path='/Reports/ReportDashboard/' search='?ReportType=WipsamManagement' element={<BIReports />} />
          </Route>
          <Route path='/Reports/ReportDashboard/:ReportType' search='?ReportType=WipsamPCA' element={<PrivateRoute permissionList={permissionDetails}  module={ModuleName.ReportWipsamPCA} permissionLevel="Read" />}>
            <Route path='/Reports/ReportDashboard/:ReportType' search='?ReportType=WipsamPCA' element={<BIReports />} />
          </Route>
          <Route path='/Reports/ReportDashboard/:ReportType' search='?ReportType=AuditReport' element={<PrivateRoute permissionList={permissionDetails}  module={ModuleName.ReportAudit} permissionLevel="Read" />}>
            <Route path='/Reports/ReportDashboard/:ReportType' search='?ReportType=AuditReport' element={<BIReports />} />
          </Route>
          <Route path='/Reports/ReportDashboard/:ReportType' search='?ReportType=PricingTool' element={<PrivateRoute permissionList={permissionDetails}  module={ModuleName.ReportPriceReport} permissionLevel="Read" />}>
            <Route path='/Reports/ReportDashboard/:ReportType' search='?ReportType=PricingTool' element={<BIReports />} />
          </Route>
          <Route path='/CMSApi/DMEGeography' element={<PrivateRoute permissionList={permissionDetails}  module={ModuleName.DMEService} permissionLevel="Write" />}>
            <Route path='/CMSApi/DMEGeography' element={<DMEGeographyApiStorage />} />
          </Route>
          <Route path='/CMSApi/DMEService' element={<PrivateRoute permissionList={permissionDetails}  module={ModuleName.DMEGeography} permissionLevel="Write" />}>
            <Route path='/CMSApi/DMEService' element={<DMEServiceApiStorage />} />
          </Route>
          <Route path='/' element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
