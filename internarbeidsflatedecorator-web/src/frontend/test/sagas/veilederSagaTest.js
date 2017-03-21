import { expect } from 'chai';
import { veilederSaga } from '../../v2Js/sagas/veilederSaga';
import * as actions from '../../v2Js/actions/veileder_actions';
import { get } from '../../v2Js/sagas/api/index';
import { put, call } from 'redux-saga/effects';

describe("veilederSagas", () => {
    const action = actions.hentVeileder();
    const generator = veilederSaga(action);

    it("Skal dispatche HENTER_VEILEDER", () => {
        const nextPut = put({type: 'HENTER_VEILEDER'});
        expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal dernest hente veileder", () => {
        const nextCall = call(get, "https://app.adeo.no/veilarbveileder/tjenester/veileder/me");
        expect(generator.next().value).to.deep.equal(nextCall);
    });

    it("Skal dernest sette dine veileder", () => {
        const nextPut = put({
            type: 'VEILEDER_HENTET',
            data: "data",
        });
        expect(generator.next("data").value).to.deep.equal(nextPut);
    });
});