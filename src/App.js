
import './App.css';
import HomePage from "./Pages/Home";
import DMDashboardPage from "./Pages/DM/dashboard";
import DMActionViewPage from "./Pages/DM/view-actions";
import DMCreateActionPage from "./Pages/DM/create-action";
import BIReports from "./Pages/BIReports/ReportDashboard";
import PrivateRoute from './components/PrivateRoute';
import FileUpload from "./Pages/SM/FileUpload";
import ModuleSelection from "./Pages/SM/ModuleSelection";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
// import { useEffect, useState } from 'react';

function App() {
  // useEffect(() => {


  // });

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/SM/FileUpload' element={<PrivateRoute />}>
            <Route path="/SM/FileUpload/" strict exact element={<FileUpload />} />
          </Route>
          <Route path='/SM/ModuleSelection' element={<PrivateRoute />}>
            <Route path="/SM/ModuleSelection/" element={<ModuleSelection />} />
          </Route>
          <Route path='/DM/DMDashboardPage' element={<PrivateRoute />}>
            <Route path='/DM/DMDashboardPage' element={<DMDashboardPage />} />
          </Route>
          <Route path='/DM/DMActionViewPage' element={<PrivateRoute />}>
            <Route path='/DM/DMActionViewPage' element={<DMActionViewPage />} />
          </Route>
          <Route path='/DM/DMCreateActionPage' element={<PrivateRoute />}>
            <Route path='/DM/DMCreateActionPage' element={<DMCreateActionPage />} />
          </Route>
          <Route path='/Reports/ReportDashboard' element={<PrivateRoute />}>
            <Route path='/Reports/ReportDashboard' element={<BIReports />} />
          </Route>
          <Route path='/' element={<HomePage />} />         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
