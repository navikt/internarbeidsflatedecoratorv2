import { expect } from 'chai';
import { saksbehandlerSaga } from '../../v2Js/sagas/saksbehandlerSaga';
import * as actions from '../../v2Js/actions/saksbehandler_actions';
import { get } from '../../v2Js/sagas/api/index';
import { put, call } from 'redux-saga/effects';

describe("saksbehandlerSagas", () => {
    const action = actions.hentSaksbehandler();
    const generator = saksbehandlerSaga(action);

    it("Skal dispatche HENTER_SAKSBEHANDLER", () => {
        const nextPut = put({type: 'HENTER_SAKSBEHANDLER'});
        expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal dernest hente saksbehandler", () => {
        const nextCall = call(get, "/veilarbveileder/tjenester/veileder/me");
        expect(generator.next().value).to.deep.equal(nextCall);
    });

    it("Skal dernest sette dine saksbehandler", () => {
        const nextPut = put({
            type: 'SAKSBEHANDLER_HENTET',
            data: "data",
        });
        expect(generator.next("data").value).to.deep.equal(nextPut);
    });
});