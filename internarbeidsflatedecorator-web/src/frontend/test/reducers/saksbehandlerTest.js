import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import saksbehandler from '../../v2Js/reducers/saksbehandler';

describe('saksbehandler', () => {

    it("har en default state", () => {
        const nextState = saksbehandler();
        expect(nextState).to.deep.equal({
            henter: false,
            hentingFeilet: false,
            data: {},
        });
    });

    it("Håndterer SAKSBEHANDLER_HENTET", () => {
        const initialState = deepFreeze({});
        const action = {
            type: 'SAKSBEHANDLER_HENTET',
            data: {
                saksbehandler: "NAV OSLO"
            },
        };
        const nextState = saksbehandler(initialState, action);
        expect(nextState).to.deep.equal({
            henter: false,
            hentingFeilet: false,
            data: {
                saksbehandler: "NAV OSLO",
            },
        });
    });

    it("Håndterer HENT_SAKSBEHANDLER_FORESPURT", () => {
        const initialState = saksbehandler();
        const action = {
            type: 'HENT_SAKSBEHANDLER_FORESPURT',
        };
        const nextState = saksbehandler(initialState, action);
        expect(nextState).to.deep.equal({
            data: {},
            henter: true,
            hentingFeilet: false,
        })
    });

    it("Håndterer HENT_SAKSBEHANDLER_FEILET", () => {
        const initialState = saksbehandler();
        const action = {
            type: 'HENT_SAKSBEHANDLER_FEILET'
        };
        const nextState = saksbehandler(initialState, action);
        expect(nextState).to.deep.equal({
            data: {},
            henter: false,
            hentingFeilet: true,
        })
    });
});