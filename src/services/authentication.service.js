import { BehaviorSubject } from 'rxjs';
// import { handleResponse } from '../helpers/handle-response';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
const clientId = new BehaviorSubject(JSON.parse(localStorage.getItem('ClientId')));
export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () {return currentUserSubject.value; },
    get clientId() {return clientId.value;},
    setClientLocalStorage
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ username, password })        
    };   
    return fetch(process.env.REACT_APP_SERVER_BASE_URL+'user/authenticate', requestOptions)
        .then((response) => response.json())
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
          if(typeof user.role !== "undefined" && user.message !==null)
          {
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);
          }
            //return JSON.stringify( { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role:"Admin" })
            return user;
        });
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}

function setClientLocalStorage(clientId){
    localStorage.setItem('ClientId', JSON.stringify(clientId));
}