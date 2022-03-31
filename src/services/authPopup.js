import { msalConfig, loginRequest, tokenRequest } from './authConfig';
import { callMSGraph } from './graph';
import { graphConfig } from './graphConfig';
import Cookies from 'universal-cookie';
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
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
        //localStorage.setItem('useraccesstoken', JSON.stringify(resp.accessToken));
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
    instance.logoutPopup().catch(e => {
        console.log(e);
    });
    localStorage.removeItem('currentUser');
    localStorage.removeItem('useraccesstoken');
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

loadPage();

export const activeDirectoryService = {
    signIn,
    signOut,
    seeProfile,
    readMail,
    getTokenPopup
};