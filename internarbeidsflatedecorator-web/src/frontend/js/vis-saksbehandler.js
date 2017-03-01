import { fetchToJson } from './rest-utils';

const visSaksbehandler = (data) => {
    const saksbehandlerNavn = document.getElementById('js-dekorator-saksbehandler-navn');
    const saksbehandlerIdent = document.getElementById('js-dekorator-saksbehandler-ident');
    if(!data.navn || !data.ident){
        return;
    }
    saksbehandlerNavn.innerHTML = data.navn;
    saksbehandlerIdent.innerHTML = `(${data.ident})`;
};

const hentSaksbehandlerNavnOgIdent = () => {
    const url = `http://${window.location.hostname}:9591/veilarbveileder/tjenester/veileder/me`;
    const credentials = {
        credentials: 'same-origin',
        headers: {
            authorization: 'Bearer eyAidHlwIjogIkpXVCIsICJhbGciOiAiUlMyNTYiIH0.eyAiYXVkIjogIk9JREMiLCAic3ViIjogIlo5OTA2MTAiLCAiYXpwIjogIk9JREMiLCAiYXV0aF90aW1lIjogMTQ4ODM3NTA5OSwgImlzcyI6ICJodHRwczovL2lzc28tdC5hZGVvLm5vL29wZW5hbS9vaWRjIiwgImV4cCI6IDE0ODgzNzg2OTksICJpYXQiOiAxNDg4Mzc1MDk5LCAibm9uY2UiOiAiMC42MjcxNDgzMTg0NzE5NDYyIiwgImp0aSI6ICJiMzkyMDQ3YS05N2JjLTQxNDgtOWMyZi0wNTRiOTNmM2Q5NTciIH0.yxB_9KPTacpE5Pk7G1aMKP8iHKx_pfdNKuiiTGaFaNdEdYnT-n5g8etNTJ1CMKMU3U1-qVgFezv5mIZiUzBHql_MJO9Wqj6XztFYS1H2tgDrYEA6mjSBrhrvbxcb2IE12tCnZHDfPygVqUWhwr6H5_OvRAzYBu0Q4j7U9WxHbzyh8BmwgjHSjowP7LiyAg2CHC4KaE1uY-SDnwg0zUkTyfDMtYaq4FrFsCgw3GBzIaBQrTVKLw7wbNzvnY7IxMDPkMs9qmA2x23gHS4qb_glMJdKFJ4TCvpMUg7rbfwiMUq3XeWhckETAh3lLnFUsBnKOxj4mBO0DrnxJv04aRfG3g'
        }
    };
    return fetchToJson(url, credentials)
        .then(visSaksbehandler);
};

const saksbehandler = () => {
        hentSaksbehandlerNavnOgIdent();
};

export default saksbehandler;
