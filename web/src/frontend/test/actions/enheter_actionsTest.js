import chai from 'chai';
import React from 'react'
import chaiEnzyme from 'chai-enzyme';
import * as actions from '../../js/actions/enheter_actions.js';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("enheter_actions", () => {

    it("Skal ha en hentEnheterFeilet()-funksjon som returnerer riktig action", () => {
        const res = actions.hentEnheterFeilet();
        expect(res).to.deep.equal({
            type: 'HENT_ENHETER_FEILET',
        })
    });

    it("Skal ha en hentEnheter()-funksjon som returnerer riktig action", () => {
        const res = actions.hentEnheter();
        expect(res).to.deep.equal({
            type: 'HENT_ENHETER_FORESPURT',
        })
    });

    it("Skal ha en enheterHentet()-funksjon som returnerer riktig action", () => {
        const res = actions.enheterHentet({ enhet: 'en enhet' });
        expect(res).to.deep.equal({
            type: 'ENHETER_HENTET',
            data: {
                enhet: 'en enhet',
            },
        });
    });
});
