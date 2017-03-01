import { fetchToJson } from './rest-utils';

const visSaksbehandlerOgEnhet = (visEnhet, visSaksbehandler, data) => {
    if(!data.navn || !data.ident || !data.enheter) {
        return;
    }

    if(visSaksbehandler) {
        document.getElementById('js-dekorator-saksbehandler-navn').innerHTML = data.navn;
        document.getElementById('js-dekorator-saksbehandler-ident').innerHTML = `(${data.ident})`;
    }
    if(visEnhet) {
        document.getElementById('js-dekorator-enhet-navn').innerHTML = data.enheter[0].navn;
    }
};

const hentSaksbehandlerNavnOgIdent = (visEnhet, visSaksbehandler) => {
    const url = `http://${window.location.hostname}:9591/veilarbveileder/tjenester/veileder/me`;
    const credentials = {
        credentials: 'same-origin',
        headers: {
            authorization: 'Bearer eyAidHlwIjogIkpXVCIsICJhbGciOiAiUlMyNTYiIH0.eyAiYXVkIjogIk9JREMiLCAic3ViIjogIlo5OTA2MTAiLCAiYXpwIjogIk9JREMiLCAiYXV0aF90aW1lIjogMTQ4ODM4MTgyMywgImlzcyI6ICJodHRwczovL2lzc28tdC5hZGVvLm5vL29wZW5hbS9vaWRjIiwgImV4cCI6IDE0ODgzODU0MjMsICJpYXQiOiAxNDg4MzgxODIzLCAibm9uY2UiOiAiMC44NTc3NTAxNTAzMDMzODgiLCAianRpIjogIjFlZTIyY2YyLTIxMTQtNGNkZi1hMjcwLTg5YmE3ZDY1ODQ2NSIgfQ.raM0AmsmEGBscBEMeFqWCyTdBy1OkBxVMeEyOSfH9CpvLSa2MZH86lgFud6uG7XIvux0aalXu-KYCJ4z5qvMETJcq1wHC2gblqmPvVxoWp1rRYgD9evlvchOxJ2OMix3d4PZVcM1Dyo2Klt7PPBZ-pqKpX3U4uQyD6EHypnLoEorE69JNEGJCXjmSegZtBKEPCgckqNF5tHDWZAvI40R7HgrG5CV0GEVQlJ73W2t9gfH5AsBf_eWS4wfnQvcbfVQlkdNHoUuI9Xn4kJIfYpEQQ5brZDICw7RGmEAZHp8si-sn_q35Zi2G4TSMlXbYZY3vIM-hCz0MVft7kMSMDD7cw'
        }
    };
    return fetchToJson(url, credentials)
        .then(
            (data) => visSaksbehandlerOgEnhet(visEnhet, visSaksbehandler, data)
        );
};

const saksbehandler = (visEnhet, visSaksbehandler) => {
        hentSaksbehandlerNavnOgIdent(visEnhet, visSaksbehandler);
};

export default saksbehandler;
