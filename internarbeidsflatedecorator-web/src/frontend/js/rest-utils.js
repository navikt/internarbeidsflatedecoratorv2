import 'whatwg-fetch';

export function sjekkStatuskode(response) {
    if (response.status >= 200 && response.status < 300 && response.ok) {
        return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

export function toJson(response) {
    if (response.status !== 204) { // No content
        return response.json();
    }
    return response;
}

export function fetchToJson(url, config = {}) {
    return fetch(url, config) //eslint-disable-line
        .then(sjekkStatuskode)
        .then(toJson);
}