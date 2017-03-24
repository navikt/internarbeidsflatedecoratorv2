import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import enheter from '../../v2Js/reducers/enheter';

describe('enheter', () => {

    it("har en default state", () => {
        const nextState = enheter();
        expect(nextState).to.deep.equal({
            henter: false,
            hentingFeilet: false,
            data: [],
            valgtEnhet: 'ikke_valgt',
        });
    });

    it("Håndterer ENHETER_HENTET", () => {
        const initialState = deepFreeze({});
        const action = {
            type: 'ENHETER_HENTET',
            data: [{
                enhet: "NAV OSLO"
            }],
        };
        const nextState = enheter(initialState, action);
        expect(nextState).to.deep.equal({
            henter: false,
            hentingFeilet: false,
            data: [{
                enhet: "NAV OSLO",
            }],
        });
    });

    it("Håndterer HENTER_ENHETER", () => {
        const initialState = enheter();
        const action = {
            type: 'HENTER_ENHETER',
        };
        const nextState = enheter(initialState, action);
        expect(nextState).to.deep.equal({
            data: [],
            henter: true,
            hentingFeilet: false,
            valgtEnhet: 'ikke_valgt',
        })
    });

    it("Håndterer HENT_ENHETER_FEILET", () => {
        const initialState = enheter();
        const action = {
            type: 'HENT_ENHETER_FEILET'
        };
        const nextState = enheter(initialState, action);
        expect(nextState).to.deep.equal({
            data: [],
            henter: false,
            hentingFeilet: true,
            valgtEnhet: 'ikke_valgt',
        })
    });
});