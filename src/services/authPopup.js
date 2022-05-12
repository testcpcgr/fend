import { msalConfig, loginRequest } from './authConfig';
//import { callMSGraph } from './graph';
//import { graphConfig } from './graphConfig';
import Cookies from 'universal-cookie';
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new PublicClientApplication(msalConfig);

let username = "";

function loadPage(token) {
    /**
     * See here for more info on account retrieval:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    const currentAccounts = myMSALObj.getAllAccounts();
    if (currentAccounts === null) {
        return;
    } else if (currentAccounts.length > 1) {
        // Add choose account code here
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
        username = currentAccounts[0].username;
        if (localStorage.getItem("currentUser") === null) {         
            localStorage.setItem('currentUser', JSON.stringify({ account: currentAccounts[0], token: token }));
        }
        const cookies = new Cookies();
        cookies.set('oid', currentAccounts[0].idTokenClaims.oid, { path: '/' });
    }
}

function handleResponse(resp) {
    if (resp !== null) {
        username = resp.account.username;       
        localStorage.setItem('currentUser', JSON.stringify({ account: resp.account, token: resp.accessToken }));
        const cookies = new Cookies();
        cookies.set('oid', resp.account.idTokenClaims.oid, { path: '/' });
    } else {       
        loadPage(resp.accessToken);
    }    
}

function signIn(instance) {
    instance.loginPopup(loginRequest).then(handleResponse).catch(error => {
        console.log(error);
    });
}

function signOut(instance) {
    var cookies =  new Cookies();
    instance.logoutPopup().catch(e => {
        console.log(e);
    });
    localStorage.removeItem('currentUser');
    localStorage.removeItem('UserRole');
    localStorage.removeItem('ClientId');
    localStorage.removeItem('IsProfileSwitched');
    cookies.remove('oid', { path: '/' });
}

function getTokenPopup(request) {
    /**
     * See here for more info on account retrieval:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    request.account = myMSALObj.getAccountByUsername(username);
    return myMSALObj.acquireTokenSilent(request).catch(error => {
        console.warn("silent token acquisition fails. acquiring token using redirect");
        if (error instanceof InteractionRequiredAuthError) {
            // fallback to interaction when silent call fails
            return myMSALObj.acquireTokenPopup(request).then(tokenResponse => {
                console.log(tokenResponse);

                return tokenResponse;
            }).catch(error => {
                console.error(error);
            });
        } else {
            console.warn(error);
        }
    });
}

function seeProfile() {
    // getTokenPopup(loginRequest).then(response => {
    //     callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, updateUI);
    //     profileButton.classList.add('d-none');
    //     mailButton.classList.remove('d-none');
    // }).catch(error => {
    //     console.error(error);
    // });
}

function readMail() {
    // getTokenPopup(tokenRequest).then(response => {
    //     callMSGraph(graphConfig.graphMailEndpoint, response.accessToken, updateUI);
    // }).catch(error => {
    //     console.error(error);
    // });
}

// function setClientId(resp){
//     console.log('set client id',resp.accessToken, resp.account.idTokenClaims.oid);
//     const requestOptions = {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + resp.accessToken,
//           'oid': resp.account.idTokenClaims.oid
//         },
//         body: JSON.stringify({ 'objectId': resp.account.idTokenClaims.oid }),
//       };
//       fetch(process.env.REACT_APP_SERVER_BASE_URL + 'user/getDefaultClient', requestOptions)
//         .then((response) => response.json())
//         .then(result => {
//             console.log(result);
//           if(result.message !== 'Unauthorized' && result.message !== "unable to fetch record")
//           {      
//             localStorage.setItem('ClientId', JSON.stringify(result.result[0].ClientId));
//           }
//         });

// }

loadPage();

export const activeDirectoryService = {
    signIn,
    signOut,
    seeProfile,
    readMail,
    getTokenPopup
};