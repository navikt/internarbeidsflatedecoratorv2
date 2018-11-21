import {expect} from 'chai';
import deepFreeze from 'deep-freeze';
import aktor from '../../js/reducers/aktor';

describe('aktor', () => {

    it("har en default state", () => {
        const nextState = aktor();
        expect(nextState).to.deep.equal({
            henter: false,
            hentingFeilet: false,
            data: [],
        });
    });

    it("Håndterer AKTOR_HENTET", () => {
        const initialState = deepFreeze({});
        const action = {
            type: 'AKTOR_HENTET',
            data: {
                '10108000398': {
                    'identer': [
                        {
                            'ident': '1000096233942',
                            'identgruppe': 'AktoerId',
                            'gjeldende': true
                        },
                    ],
                    'feilmelding': null
                },
            },
        };
        const nextState = aktor(initialState, action);
        expect(nextState).to.deep.equal({
            henter: false,
            hentingFeilet: false,
            data: '1000096233942',
        });
    });

    it("Håndterer HENTER_AKTOR", () => {
        const initialState = aktor();
        const action = {
            type: 'HENTER_AKTOR',
        };
        const nextState = aktor(initialState, action);
        expect(nextState).to.deep.equal({
            data: [],
            henter: true,
            hentingFeilet: false,
        })
    });

    it("Håndterer HENT_AKTOR_FEILET", () => {
        const initialState = aktor();
        const action = {
            type: 'HENT_AKTOR_FEILET'
        };
        const nextState = aktor(initialState, action);
        expect(nextState).to.deep.equal({
            data: [],
            henter: false,
            hentingFeilet: true,
        })
    });
});