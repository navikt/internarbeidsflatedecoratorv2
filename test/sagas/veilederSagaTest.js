import { expect } from 'chai';
import { veilederSaga } from '../../js/sagas/veilederSaga';
import * as actions from '../../js/actions/veileder_actions';
import { put } from 'redux-saga/effects';

describe("veilederSagas", () => {
    const action = actions.hentVeileder();
    const generator = veilederSaga(action);

    it("Skal dispatche HENTER_VEILEDER", () => {
        const nextPut = put({type: 'HENTER_VEILEDER'});
        expect(generator.next().value).to.deep.equal(nextPut);
    });

});