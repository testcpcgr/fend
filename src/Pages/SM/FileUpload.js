import { authenticationService } from '../../services/authentication.service';
import { backgroundColor, buttonColor, buttonTextColor } from "../../Constants";
import ManagerAppbar from "../../components/ManagerAppBar";
import authorised from "../../reduxReduncer/authorised";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createStore, combineReducers } from 'redux';
import { AppBar, Typography } from "@material-ui/core";
import { Provider } from 'react-redux';
import { useLocation } from "react-router-dom";
import { format } from 'react-string-format';
import * as XLSX from 'xlsx'
import Cookies from 'universal-cookie';

const FileUpload = (props) => {
    let location = useLocation();
    const [nameOfColumns, setRequiredNameOfColumns] = useState([]);
    const [filenames, setFileNames] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");    
    const [drawers, setDrawer] = useState("");
    const cookies = new Cookies();
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
    const processData = (dataString, filetypeid, requiredColNumber, cb) => {
        const dataStringLines = dataString.split(/\r\n|\n/);
        const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        const list = [];
        for (let i = 1; i < dataStringLines.length; i++) {
            const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
            if (headers && row.length == headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    let d = row[j];
                    if (d.length > 0) {
                        if (d[0] == '"')
                            d = d.substring(1, d.length - 1);
                        if (d[d.length - 1] == '"')
                            d = d.substring(d.length - 2, 1);
                    }
                    if (headers[j]) {
                        obj[headers[j]] = d;
                    }
                }
                if (Object.values(obj).filter(x => x).length > 0) {
                    list.push(obj);
                }
            }
        }
        const columns = headers.map(c => ({
            name: c
        }));
        cb(filetypeid, columns);
        validateNumberOfColumns(columns.length, requiredColNumber);
    }

    const handleFileUpload = e => {
        setErrorMessage("");
        const requiredInfo = filenames.filter(s => s.FileName == e.target.name);
        if (requiredInfo.some(x => x.FileName !== e.target.files[0].name.split(".")[0])) {
            setErrorMessage(format('Uploaded file must has name "{0}"', e.target.name));
        }
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            processData(data, e.target.id, e.target.getAttribute("requiredcolumn"), validateColumnNames);
        };
        reader.readAsBinaryString(file);
    }

    useEffect(() => {
        if (location.state !== 'undefined') {
            const items = location.state.filetypes;
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authenticationService.currentUserValue.token,
                    'oid': cookies.get('oid')
                },
                body: JSON.stringify({ 'FileTypeIds': items.toString() })
            };
            fetch(
                process.env.REACT_APP_SERVER_BASE_URL + "storage/getFileTypeDetailByFileTypeId",
                requestOptions
            )
                .then((response) => response.json())
                .then((response) => {
                    if (response.message !== 'Unauthorized') {
                        const newlist = [];
                        const map = new Map();
                        for (const item of response.filedetails) {
                            if (!map.has(item.FileName)) {
                                map.set(item.FileName, true);    // set any value to Map
                                newlist.push({
                                    FileName: item.FileName,
                                    FileTypeId: item.FileTypeId,
                                    RequiredNumberOfColumns: item.RequiredColumnNumber
                                });
                            }
                        }
                        setFileNames(newlist);

                        const newlist2 = [];
                        const map2 = new Map();
                        for (const item of response.filedetails) {
                            if (!map2.has(item.ColumnName)) {
                                map2.set(item.ColumnName, true);    // set any value to Map
                                newlist2.push({
                                    ColumnName: item.ColumnName,
                                    FileTypeId: item.FileTypeId
                                });
                            }
                        }
                        setRequiredNameOfColumns(newlist2);

                    } else {
                        setErrorMessage(response.message);
                        alert('some error occurred try again');
                    }
                })
                .catch((error) => {
                    alert(error);
                });
        }
    }, []);

    const handleSubmission = (e) => {
        e.preventDefault();
        if (errorMessage != " " || errorMessage != "") {
            const formData = new FormData(e.target);

            formData.append('auth', authenticationService.currentUserValue.token);
            formData.append('objectId', authenticationService.currentUserValue.account.localAccountId);
            fetch(
                process.env.REACT_APP_SERVER_BASE_URL + 'storage/blobupload',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authenticationService.currentUserValue.token,
                        'oid': cookies.get('oid')
                    },
                    body: formData,
                }
            )
                // .then((response) => { response.json(); })
                .then((response) => {
                    response.json();                   
                    if (response.status == 200) {
                        alert('File upload Status is :' + response.statusText);
                        window.location.href = "/?msg=" + response.statusText;
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

    };


    const validateNumberOfColumns = (fileColNumber, requiredColNumber) => {
        if (fileColNumber.toString() !== requiredColNumber.toString()) {
            setErrorMessage(format('Total {0} columns required in uploaded file', requiredColNumber));
        }
    };

    const validateColumnNames = (filetypeid, fileColNames) => {
        nameOfColumns.filter(s => s.FileTypeId == filetypeid).forEach(colName => {
            if (!fileColNames.some(e => e.name == colName.ColumnName)) {
                setErrorMessage(format('Column name {0} required in uploaded file', colName.ColumnName));
            }
        });
    };

    return (
        <div style={{ minHeight: "100vh", backgroundImage: backgroundColor }}>
            <Provider store={store}>
                <ManagerAppbar drawerOption={drawers} location="Home" />
            </Provider>
            <Panel value={1} index={1}>
                <div className="col-md-12">
                    <div className="emdeb-responsive">
                        <form onSubmit={handleSubmission} >
                            {
                                filenames.map(filename => {
                                    return (
                                        <div>
                                            <input type="file" name={filename.FileName} id={filename.FileTypeId} requiredcolumn={filename.RequiredNumberOfColumns} onChange={handleFileUpload} />
                                            <p>{filename.FileName}</p>
                                        </div>
                                    )
                                })
                            }
                            <p >{errorMessage}</p>
                            <div>
                                <input type="submit" value="Upload" />
                            </div>
                        </form>
                    </div>
                </div>
            </Panel>
        </div>
    );
}

export default FileUpload;