import React from "react";
import { Grid, TextField, Button, Typography } from "@material-ui/core";
import ZueLogo from "../Images/NHampshire-Logo.png";
import NhmsLogo from "../Images/nhmsIcon.png";
import { backgroundColor, buttonColor, buttonTextColor } from "../Constants";
import { useEffect, useState } from "react";
import { authenticationService } from '../services/authentication.service';
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const history = useNavigate();
    useEffect(() => {
        if (authenticationService.currentUserValue) {
            history('/');
        }
    }, []);
    const [username, seUserName] = useState("");
    const [password, setPassword] = useState("");

    const [login, setLogin] = useState("");
    const [errorController, setErrorController] = useState(false);
    const [errorText, setErrorText] = useState("");

    const handleLogin = () => {
        if (username && password) {
            setErrorText("");
            setErrorController("");
            authenticationService.login(username, password)
                .then(
                    user => {
                        if (typeof user.message === "undefined") {
                            if (user.role === "user") {
                                history("/user");
                            }
                            if (user.role === "User") {
                                history("/user");
                            }
                            if (user.role.toString().toLowerCase() === "admin") {
                                history("/");
                            }
                        }
                        else {
                            history("/Login")
                        }
                    }
                );
        } else {
            setErrorText("Select Employee Name & Write Password");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flex: 1,
                backgroundImage: backgroundColor,
            }}
        >
            <Grid
                container
                style={{
                    minHeight: "100vh",
                    justifyContent: "space-between",
                    display: "flex",
                    flex: 1,
                }}
            >
                <Grid item xs={12} sm={6}></Grid>
                <Grid
                    container
                    item
                    xs={12}
                    sm={12}
                    alignItems="center"
                    direction="column"
                    justifyContent="center"
                    style={{ padding: 10, backgroundColor: "white" }}
                >
                    <div />

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            maxWidth: 270,
                            minWidth: 270,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 270,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <img
                                src={ZueLogo}
                                style={{
                                    width: "70px",
                                    height: "100%",
                                    objectFit: "contain",
                                    // paddingLeft: 50,
                                }}
                                alt="NHMS LOGO"
                            />
                            <img
                                src={NhmsLogo}
                                style={{
                                    width: "170px",
                                    height: "100%",
                                    objectFit: "contain",
                                    // paddingLeft: 50,
                                }}
                                alt="NHMS LOGO"
                            />
                        </div>
                        {/* <Typography style={{ fontSize: 20, color: "#1888C6" }}>
              ZUE PORTAL
            </Typography> */}
                        <TextField
                            style={{ width: 270 }}
                            label="Username"
                            defaultValue=""
                            type="Text"
                            value={username}
                            onChange={(e) => seUserName(e.target.value)}
                        ></TextField>
                        <TextField
                            style={{ width: 270 }}
                            label="Password"
                            defaultValue=""
                            type="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></TextField>
                        <div style={{ height: 20, marginTop: 20 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleLogin}
                                style={{
                                    width: 270,
                                    backgroundColor: buttonColor,
                                    color: buttonTextColor,
                                }}
                            >
                                Sign in
                            </Button>
                        </div>
                        <Typography style={{ marginTop: 30, color: "red" }}>
                            {errorText}
                        </Typography>
                    </div>
                    <div />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        paddingBottom: 20,
                    }}
                >
                    <Typography style={{ fontSize: 12 }}>
                        To report a technical issue, please email :
                        <span style={{}}>riaz@nhmedsupply.com</span>
                    </Typography>
                    <Typography style={{ fontSize: 12 }}>
                        This web site is intended for the exclusive use of persons or
                        entities licensed to use the Zue Protal, and access is restricted
                        thereto. All trademarks used herein are trademarks of ZUE Pvt ltd.
                        The entire content of this web site is copyrighted and may not be
                        used without the permission of ZUE Pvt ltd. The use or misuse of ZUE
                        Pvt ltd's trademarks or copyrights is prohibited and may be in
                        violation of law. © 2021 ZUE Pvt ltd. All Rights Reserved. Zue
                        Portal is a registered trademark of ZUE Pvt ltd
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
}

export default LoginPage;
