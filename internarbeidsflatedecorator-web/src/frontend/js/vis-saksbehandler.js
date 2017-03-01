import { fetchToJson } from './rest-utils';

const visSaksbehandler = (data) => {
    const saksbehandlerNavn = document.getElementById('js-dekorator-saksbehandler-navn');
    const saksbehandlerIdent = document.getElementById('js-dekorator-saksbehandler-ident');
    console.log(data);
    saksbehandlerNavn.innerHTML = "Jan Nilelsen Ullmann";
    saksbehandlerIdent.innerHTML = "(Z606404)";
};

const hentSaksbehandlerNavnOgIdent = () => {
    const url = `http://${window.location.hostname}:9591/veilarbveileder/tjenester/veileder/me`;
    const credentials = {
        headers: {
            authorization: 'Bearer eyAidHlwIjogIkpXVCIsICJhbGciOiAiUlMyNTYiIH0.eyAiYXVkIjogIk9JREMiLCAic3ViIjogIlo5OTA2MTAiLCAiYXpwIjogIk9JREMiLCAiYXV0aF90aW1lIjogMTQ4ODM2OTc5MSwgImlzcyI6ICJodHRwczovL2lzc28tdC5hZGVvLm5vL29wZW5hbS9vaWRjIiwgImV4cCI6IDE0ODgzNzMzOTEsICJpYXQiOiAxNDg4MzY5NzkxLCAibm9uY2UiOiAiMC41NTcwNjYzMDExMjk2MTY2IiwgImp0aSI6ICJmMTQ5OTYxMC1iYTM4LTQ4MzYtOTExOC0xYzlhNmZmZDRkZjYiIH0.Kh1_B7MFbGiDaPmD3nglU3DsOXscGghNqGzfNaqFmDJEXrhW9JfY2CDgQxem74opl5FYbL2qi51LZ_4nrZsSLRsHAFS7TQgJgOAu0FeZWduzjWXYGhzQGJ84OenfqTWw5YX9WdJqbxZu006lzrvz6Yo1F4VHKk9tbnU2c-H7sJFj0Bhza0YN3TtqsSQlBNkgeZVoH1qiYZK9_QAFh67c4O_EPewHAIq1AHx4ENhwqbhV___aWQ79jm_dgPKgR5CVvoC5h-mIGDyMla1OXLSPbpzw8MDv8g9rcTFDnomfODXfetwF7ppQ42RHvBJTc4QT_dlAVMUzueMO_na70ocLLg'
        }
    };
    return fetchToJson(url, credentials)
        .then(visSaksbehandler);
};

const saksbehandler = () => {
        hentSaksbehandlerNavnOgIdent();
};

export default saksbehandler;
