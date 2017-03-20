import { expect } from 'chai';
import { enheterSaga } from '../../v2Js/sagas/enheterSaga';
import * as actions from '../../v2Js/actions/enheter_actions';
import { get } from '../../v2Js/sagas/api/index';
import { put, call } from 'redux-saga/effects';

describe("enheterSagas", () => {
    const action = actions.hentEnheter();
    const generator = enheterSaga(action);

    it("Skal dispatche HENTER_ENHETER", () => {
        const nextPut = put({type: 'HENTER_ENHETER'});
        expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal dernest hente enheter", () => {
        const nextCall = call(get, "https://modapp.adeo.no/veilarbveileder/tjenester/veileder/enheter");
        expect(generator.next().value).to.deep.equal(nextCall);
    });

    it("Skal dernest sette dine enheter", () => {
        const nextPut = put({
            type: 'ENHETER_HENTET',
            data: "data",
        });
        expect(generator.next("data").value).to.deep.equal(nextPut);
    });
});