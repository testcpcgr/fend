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
import { Link } from "react-router-dom";
import ListAltIcon from "@material-ui/icons/ListAlt";
import SettingsIcon from "@material-ui/icons/Settings";
import CalculateIcon from "@mui/icons-material/Calculate";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { logOutEmployee } from "../reduxAction/authorised";
import { mainAppBarColor, mainAppBarTextColor } from "../Constants";
import NhmsBanner from "../Images/NhmsBanner.png";
import AlarmIcon from "@mui/icons-material/Alarm";

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
  const dispatch = useDispatch();
  const menuItems = [
    {
      text: "Home",
      icon: <HomeIcon color="primary" />,
      path: "/",
    },
    {
      text: "Driver Monitoring",
      icon: <AlarmIcon style={{ color: "#3F51B5" }} />,
      path: "/drivermonitoring/index",
    }
  ];
  useEffect(() => {
    setDrawer(props.drawerOption);
  }, [props.drawerOption]);
  const [drawer, setDrawer] = useState(false);
  const classes = useStyles();
  const userLoggedIn = useSelector((state) => state.authorised);
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
  const handleLogOut = () => {
    dispatch(logOutEmployee());
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
            {menuItems.map((item) => (
              <Link
                to={item.path}
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItem button key={item.text}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    classes={{ primary: classes.listItemText }}
                  />
                </ListItem>
              </Link>
            ))}
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
              ZUE NHMS PORTAL
            </Link>

            <Typography style={{ fontSize: 12, color: mainAppBarTextColor }}>
              {location}
            </Typography>
          </div>
          <Button color="inherit" startIcon={<PersonIcon />}>
            <Typography
              variant="p"
              className={classes.title}
              style={{ fontSize: 12, color: mainAppBarTextColor }}
            >
              {userLoggedIn?.employeeName?._}
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default ManagerAppBar;
