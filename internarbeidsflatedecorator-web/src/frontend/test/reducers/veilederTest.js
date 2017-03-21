import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import veileder from '../../v2Js/reducers/veileder';

describe('veileder', () => {

    it("har en default state", () => {
        const nextState = veileder();
        expect(nextState).to.deep.equal({
            henter: false,
            hentingFeilet: false,
            data: {},
        });
    });

    it("Håndterer VEILEDER_HENTET", () => {
        const initialState = deepFreeze({});
        const action = {
            type: 'VEILEDER_HENTET',
            data: {
                veileder: "NAV OSLO"
            },
        };
        const nextState = veileder(initialState, action);
        expect(nextState).to.deep.equal({
            henter: false,
            hentingFeilet: false,
            data: {
                veileder: "NAV OSLO",
            },
        });
    });

    it("Håndterer HENTER_VEILEDER", () => {
        const initialState = veileder();
        const action = {
            type: 'HENTER_VEILEDER',
        };
        const nextState = veileder(initialState, action);
        expect(nextState).to.deep.equal({
            data: {},
            henter: true,
            hentingFeilet: false,
        })
    });

    it("Håndterer HENT_VEILEDER_FEILET", () => {
        const initialState = veileder();
        const action = {
            type: 'HENT_VEILEDER_FEILET'
        };
        const nextState = veileder(initialState, action);
        expect(nextState).to.deep.equal({
            data: {},
            henter: false,
            hentingFeilet: true,
        })
    });
});