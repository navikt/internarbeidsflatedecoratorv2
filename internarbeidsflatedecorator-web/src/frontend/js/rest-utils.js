import 'whatwg-fetch';

export function sjekkStatuskode(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

export function toJson(response) {
    const NO_CONTENT_STATUSCODE = 204;
    if (response.status !== NO_CONTENT_STATUSCODE) {
        return response.json();
    }
    return response;
}

export function fetchToJson(url, config = {}) {
    const credentials = 'same-origin';
    const secConfig = { credentials };
    return fetch(url, { ...secConfig, ...config})
        .then(sjekkStatuskode)
        .then(toJson);
}