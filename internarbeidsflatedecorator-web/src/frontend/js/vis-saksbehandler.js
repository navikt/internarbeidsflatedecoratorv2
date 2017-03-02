import { fetchToJson } from './rest-utils';

const visSaksbehandler = (data) => {
    if(!data.navn || !data.ident) {
        return;
    }
    document.getElementById('js-dekorator-saksbehandler-navn').innerHTML = data.navn;
    document.getElementById('js-dekorator-saksbehandler-ident').innerHTML = `(${data.ident})`;
};

const visEnhet = (data) => {
    if(!data.enhetliste || !data.enhetliste[0].navn) {
        return;
    }
    document.getElementById('js-dekorator-enhet-navn').innerHTML = data.enhetliste[0].navn;
};

export const hentSaksbehandler = () => {
    const url = `http://${window.location.hostname}:9591/veilarbveileder/tjenester/veileder/me`;
    const credentials = {
        credentials: 'same-origin',
        headers: {
            authorization: 'Bearer eyAidHlwIjogIkpXVCIsICJhbGciOiAiUlMyNTYiIH0.eyAiYXVkIjogIk9JREMiLCAic3ViIjogIlo5OTA2MTAiLCAiYXpwIjogIk9JREMiLCAiYXV0aF90aW1lIjogMTQ4ODQ1MjAyMSwgImlzcyI6ICJodHRwczovL2lzc28tdC5hZGVvLm5vL29wZW5hbS9vaWRjIiwgImV4cCI6IDE0ODg0NTU2MjEsICJpYXQiOiAxNDg4NDUyMDIxLCAibm9uY2UiOiAiMC4yMDg4OTgxNjU0NDU2NzQzIiwgImp0aSI6ICJhZTU5YTdkNi01YmY4LTQyYzgtYWFiNi0zOTlhMGUxZDU5MGQiIH0.p2cFSTG7zvmMGuSmIu-ZZ8W-ajPBPqTv9QTV3tkTD7V4-8tzrDK7-VA8atJmByb0XEXPMZC4xY4sU6ijZhwvCvXYrwPv9PzdVwm8M0TDkN8UU-QInfDLu4yRldcd_-HjWqQ6cKUtmcfVaRinYOCeQLmQkcoKRIZRax_84UW-phRReJOyk41fZzVv3VG5owe3FEzERD2C0mquIMaPZNZQvhOlQOq0_-ag6ka2ZJjSKKdbV40aPWeMAOklxt0i7MV7BqfqE9BVIOWRWiMJgvZx1MXOUBNIgOJtUQQsfq2-RI3Qi2RSToO0VWYB1PHQsETT9JImz7MzQ8QFniF7b_n0Aw'
        }
    };
    return fetchToJson(url, credentials)
        .then(
            visSaksbehandler,
            (error) => console.log(error)
        );
};

export const hentEnheter = () => {
    const url = `http://${window.location.hostname}:9591/veilarbveileder/tjenester/veileder/enheter`;
    const credentials = {
        credentials: 'same-origin',
        headers: {
            authorization: 'Bearer eyAidHlwIjogIkpXVCIsICJhbGciOiAiUlMyNTYiIH0.eyAiYXVkIjogIk9JREMiLCAic3ViIjogIlo5OTA2MTAiLCAiYXpwIjogIk9JREMiLCAiYXV0aF90aW1lIjogMTQ4ODQ1MjAyMSwgImlzcyI6ICJodHRwczovL2lzc28tdC5hZGVvLm5vL29wZW5hbS9vaWRjIiwgImV4cCI6IDE0ODg0NTU2MjEsICJpYXQiOiAxNDg4NDUyMDIxLCAibm9uY2UiOiAiMC4yMDg4OTgxNjU0NDU2NzQzIiwgImp0aSI6ICJhZTU5YTdkNi01YmY4LTQyYzgtYWFiNi0zOTlhMGUxZDU5MGQiIH0.p2cFSTG7zvmMGuSmIu-ZZ8W-ajPBPqTv9QTV3tkTD7V4-8tzrDK7-VA8atJmByb0XEXPMZC4xY4sU6ijZhwvCvXYrwPv9PzdVwm8M0TDkN8UU-QInfDLu4yRldcd_-HjWqQ6cKUtmcfVaRinYOCeQLmQkcoKRIZRax_84UW-phRReJOyk41fZzVv3VG5owe3FEzERD2C0mquIMaPZNZQvhOlQOq0_-ag6ka2ZJjSKKdbV40aPWeMAOklxt0i7MV7BqfqE9BVIOWRWiMJgvZx1MXOUBNIgOJtUQQsfq2-RI3Qi2RSToO0VWYB1PHQsETT9JImz7MzQ8QFniF7b_n0Aw'
        }
    };
    return fetchToJson(url, credentials)
        .then(
            visEnhet,
            (error) => console.log(error)
        );
};

