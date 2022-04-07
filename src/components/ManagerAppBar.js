import React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useSelector, useDispatch } from "react-redux";
import Drawer from "@material-ui/core/Drawer";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import List from "@material-ui/core/List";
import { Link, useNavigate } from "react-router-dom";
import ListAltIcon from "@material-ui/icons/ListAlt";
import SettingsIcon from "@material-ui/icons/Settings";
import CalculateIcon from "@mui/icons-material/Calculate";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItemButton from "@mui/material/ListItemButton";
import { logOutEmployee } from "../reduxAction/authorised";
import { mainAppBarColor, mainAppBarTextColor } from "../Constants";
import NhmsBanner from "../Images/NhmsBanner.png";
import AlarmIcon from "@mui/icons-material/Alarm";
import { activeDirectoryService } from '../services/authPopup';
import GroupIcon from "@mui/icons-material/Group";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import PermissionProvider from './PermissionProvider';
import { useMsal } from "@azure/msal-react";
import { authenticationService } from '../services/authentication.service';
import Cookies from 'universal-cookie';
import { ModuleName } from '../helpers/enum/Module_Enum';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
}));

const ManagerAppBar = (props) => {
  const history = useNavigate();
  const dispatch = useDispatch();
  var [permissionDetails, setPermissionDetails] = useState([]);
  const cookies = new Cookies();
  const { instance } = useMsal();
  const [drawer, setDrawer] = useState(false);
  const classes = useStyles();
  const [userLoggedIn, setUserLoggedIn] = React.useState({});
  const [dmmenuopen, setDMOpen] = React.useState(false);
  const [reportmenuopen, setReportOpen] = React.useState(false);
  useEffect(() => {

    setDrawer(props.drawerOption);
  }, [props.drawerOption]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawer(open);
  };
  const [location, setLocation] = useState("Home");

  useEffect(() => {

    setLocation(props.location);
  }, props.location);


  useEffect(() => {  
    
    var requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token,
        'oid': cookies.get('oid')
      },
      body: JSON.stringify({ 'objectId': JSON.parse(localStorage.getItem('currentUser')).account.localAccountId }),
    };
    fetch(process.env.REACT_APP_SERVER_BASE_URL + 'user/getDefaultClient', requestOptions)
      .then((response) => response.json())
      .then(result => {
          console.log(result);
        if(result.message !== 'Unauthorized' && result.message !== "unable to fetch record")
        {      
          localStorage.setItem('ClientId', JSON.stringify(result.result[0].ClientId));
        }
      });





    console.log('clientid',authenticationService.clientId);   
    setUserLoggedIn(JSON.parse(localStorage.getItem('currentUser')).account);
    requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token,
        'oid': cookies.get('oid')
      },
      body: JSON.stringify({ 'objectId': JSON.parse(localStorage.getItem('currentUser')).account.localAccountId, 'clientId': authenticationService.clientId }),
    };
    fetch(process.env.REACT_APP_SERVER_BASE_URL + 'user/getUserPermissionByObjectId', requestOptions)
      .then((response) => response.json())
      .then(result => {
        if(result.message !== 'Unauthorized' && result.message !== "unable to fetch record")
        {      
          setPermissionDetails(result.result);
          localStorage.setItem('UserRole', JSON.stringify({ permissionLevelId: result.result[0].PermissionLeveId, role: result.result[0].Role }));
        }
      });
  }, []);


  const handleLogOut = () => {
    activeDirectoryService.signOut(instance);
  };

  const handleDMClick = () => {
    setDMOpen(!dmmenuopen);
  };
  const handleReportClick = () => {
    setReportOpen(!reportmenuopen);
  };
  return (

    <div className={classes.root}>
      <Drawer open={drawer} onClose={drawer} onClose={toggleDrawer(false)}>
        <div
          className={classes.list}
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            //alignItems: "space-between",
          }}
        >
          <List>
            <Link
              to="/"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ListAltIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Home"
                  style={{ textDecoration: "none", color: "black" }}
                  classes={{ primary: classes.listItemText }}
                />
              </ListItemButton>
            </Link>
            {
              PermissionProvider({ permissionDetails: permissionDetails, moduleName: ModuleName.SMUpload, permissionLevel: "Write" }) ?
                <Link
                  to="/SM/ModuleSelection"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <ListAltIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Storage Module"
                      style={{ textDecoration: "none", color: "black" }}
                      classes={{ primary: classes.listItemText }}
                    />
                  </ListItemButton>

                </Link>
                : <></>
            }
            <div>
              <ListItemButton onClick={handleDMClick}>
                <ListItemIcon>
                  <GroupIcon style={{ color: "#3F51B5" }} />
                </ListItemIcon>
                <ListItemText primary="Driver Monitoring" />
                {dmmenuopen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={dmmenuopen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {
                    PermissionProvider({ permissionDetails: permissionDetails, moduleName: ModuleName.DMDashboard, permissionLevel: "Read" }) ?

                      <Link
                        to="/DM/DMDashboardPage"
                        style={{ textDecoration: "none", color: "black" }}
                        state={{ ReportType: 'Driver Monitoring' }}
                      >
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText
                            primary="Dashboard"
                            classes={{ primary: classes.listItemText }}
                          />
                        </ListItemButton>
                      </Link>
                      : <></>
                  }
                  {
                    PermissionProvider({ permissionDetails: permissionDetails, moduleName: ModuleName.DMAction, permissionLevel: "Write" }) ?

                      <Link
                        to="/DM/DMCreateActionPage"
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText
                            primary="Create Action"
                            classes={{ primary: classes.listItemText }}
                          />
                        </ListItemButton>
                      </Link>
                      : <></>
                  }
                  {
                    PermissionProvider({ permissionDetails: permissionDetails, moduleName:ModuleName.DMAction, permissionLevel: "Read" }) ?

                      <Link
                        to="/DM/DMActionViewPage"
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText
                            primary="View Action"
                            classes={{ primary: classes.listItemText }}
                          />
                        </ListItemButton>
                      </Link>
                      : <></>
                  }
                </List>
              </Collapse>
              <ListItemButton onClick={handleReportClick}>
                <ListItemIcon>
                  <GroupIcon style={{ color: "#3F51B5" }} />
                </ListItemIcon>
                <ListItemText primary="Reports" />
                {reportmenuopen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={reportmenuopen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {
                    PermissionProvider({ permissionDetails: permissionDetails, moduleName: ModuleName.ReportWipsam, permissionLevel: "Read" }) ?

                      <Link
                        to='/Reports/ReportDashboard'
                        style={{ textDecoration: "none", color: "black" }}
                        state={{ ReportType: 'Wipsam' }}
                      >
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText
                            primary="Wipsam"
                            classes={{ primary: classes.listItemText }}
                          />
                        </ListItemButton>
                      </Link>
                      : <></>
                  }
                  {
                    PermissionProvider({ permissionDetails: permissionDetails, moduleName: ModuleName.ReportWipsamManagement, permissionLevel: "Read" }) ?

                      <Link
                        to='/Reports/ReportDashboard'
                        style={{ textDecoration: "none", color: "black" }}
                        state={{ ReportType: 'Wipsam Management' }}
                      >
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText
                            primary="Wipsam Management"
                            classes={{ primary: classes.listItemText }}
                          />
                        </ListItemButton>
                      </Link>
                      : <></>
                  }
                  {
                    PermissionProvider({ permissionDetails: permissionDetails, moduleName: ModuleName.ReportWipsamPCA, permissionLevel: "Read" }) ?

                      <Link
                        to='/Reports/ReportDashboard'
                        style={{ textDecoration: "none", color: "black" }}
                        state={{ ReportType: 'Wipsam PCA' }}
                      >
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText
                            primary="Wipsam PCA"
                            classes={{ primary: classes.listItemText }}
                          />
                        </ListItemButton>
                      </Link>
                      : <></>
                  }
                  {
                    PermissionProvider({ permissionDetails: permissionDetails, moduleName:ModuleName.ReportAudit, permissionLevel: "Read" }) ?

                      <Link
                        to='/Reports/ReportDashboard'
                        style={{ textDecoration: "none", color: "black" }}
                        state={{ ReportType: 'Audit Report' }}
                      >
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText
                            primary="Audit Report"
                            classes={{ primary: classes.listItemText }}
                          />
                        </ListItemButton>
                      </Link>
                      : <></>
                  }
                  {
                    PermissionProvider({ permissionDetails: permissionDetails, moduleName: ModuleName.ReportPriceReport, permissionLevel: "Read" }) ?

                      <Link
                        to='/Reports/ReportDashboard'
                        style={{ textDecoration: "none", color: "black" }}
                        state={{ ReportType: 'Pricing Tool' }}
                      >
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText
                            primary="Price Report"
                            classes={{ primary: classes.listItemText }}
                          />
                        </ListItemButton>
                      </Link>
                      : <></>
                  }
                </List>
              </Collapse>
            </div>
          </List>
          <div onClick={handleLogOut}>
            <ListItem button>
              <ListItemIcon>
                <LogoutIcon color="primary" style={{ color: "#3F51B5" }} />
              </ListItemIcon>
              <ListItemText
                primary="Sign Out"
              //classes={{ primary: classes.listItemText }}
              />
            </ListItem>
          </div>
        </div>
      </Drawer>
      <AppBar position="static" style={{ backgroundImage: mainAppBarColor }}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <img
            src={NhmsBanner}
            style={{
              width: "40px",
              height: "100%",
              objectFit: "contain",
              // paddingLeft: 50,
            }}
            alt="NHMS LOGO"
          />
          <div className={classes.title}>
            <Link
              to="/manager"
              style={{
                fontSize: 14,
                textDecoration: "none",
                color: mainAppBarTextColor,
              }}
            >
              CPCGR PORTAL
            </Link>

            <Typography style={{ fontSize: 12, color: mainAppBarTextColor }}>
              {/* {location} */}
            </Typography>
          </div>
          <Button color="inherit" startIcon={<PersonIcon />}>
            <Typography
              variant="p"
              className={classes.title}
              style={{ fontSize: 12, color: mainAppBarTextColor }}
            >
              {userLoggedIn.name}
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default ManagerAppBar;
