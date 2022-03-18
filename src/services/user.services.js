
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export {
    getAll,getById
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(process.env.REACT_APP_SERVER_BASE_URL, requestOptions);
    //.then(handleResponse);
}
function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(process.env.REACT_APP_SERVER_BASE_URL, requestOptions);
    //.then(handleResponse);
    //return ({ ok: true, text: () => Promise.resolve(JSON.stringify({ id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role:'Admin' })) });
    //return JSON.stringify();
}