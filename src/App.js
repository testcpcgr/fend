
import './App.css';
import LoginPage from "./Pages/Login";
import HomePage from "./Pages/Home";
import AdminUsersPage from "./Pages/AdminUsers";
import { Role } from './helpers/Roles';
import { history } from './helpers/history';
import { authenticationService } from './services/authentication.service';
import PrivateRoute from './components/PrivateRoute';
import FileUpload from "./Pages/SM/FileUpload";
import ModuleSelection from "./Pages/SM/ModuleSelection";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";
import { useEffect, useState } from 'react';

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [isAdmin, setIsAdminFlag] = useState();
  useEffect(() => {

    authenticationService.currentUser.subscribe(x => {
      if (x !== null && typeof x.message === "undefined") {
        setCurrentUser(x);
        setIsAdminFlag(x && x.role === Role.Admin);
      }
    });
  });

  const logout = () => {
    authenticationService.logout();
    history.push('/login');
  }

  return (
    <Router>
      <div className="App">
        {currentUser &&
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
              <Link to="/" className="nav-item nav-link">Home</Link>
              {isAdmin && <Link to="/admin" className="nav-item nav-link">Admin</Link>}
              <a onClick={logout} className="nav-item nav-link">Logout</a>
            </div>
          </nav>
        }
        <Routes>
          <Route exact path='/' element={<PrivateRoute />}>
            <Route exact path='/' element={<HomePage />} />
          </Route>
          <Route path='/SM/FileUpload' element={<PrivateRoute />}>
            <Route path="/SM/FileUpload/" strict exact element={<FileUpload />} />
          </Route>
          <Route path='/SM/ModuleSelection' element={<PrivateRoute />}>
            <Route path="/SM/ModuleSelection/" element={<ModuleSelection />} />
          </Route>

          <Route path='/Login' element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
