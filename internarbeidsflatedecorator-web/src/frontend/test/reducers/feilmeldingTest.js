import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import feilmelding from '../../v2Js/reducers/feilmelding';

describe('feilmelding', () => {

    it("har en default state", () => {
        const nextState = feilmelding();
        expect(nextState).to.deep.equal({
            feilmelding: null
        });
    });

    it("Håndterer VIS_FEILMELDING", () => {
        const initialState = deepFreeze({});
        const action = {
            type: 'VIS_FEILMELDING',
            data: "Intern feil",
        };
        const nextState = feilmelding(initialState, action);
        expect(nextState).to.deep.equal({
            feilmelding: "Intern feil"
        });
    });

    it("Håndterer FJERN_FEILMELDING", () => {
        const action = {
            type: 'FJERN_FEILMELDING',
        };
        const nextState = feilmelding({feilmelding: "Intern feil"}, action);
        expect(nextState).to.deep.equal({
            feilmelding: null,
        })
    });
});