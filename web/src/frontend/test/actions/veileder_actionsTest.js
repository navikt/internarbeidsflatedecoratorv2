import chai from 'chai';
import React from 'react'
import chaiEnzyme from 'chai-enzyme';
import * as actions from '../../js/actions/veileder_actions.js';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("veileder_actions", () => {

    it("Skal ha en hentVeilederFeilet()-funksjon som returnerer riktig action", () => {
        const res = actions.hentVeilederFeilet();
        expect(res).to.deep.equal({
            type: 'HENT_VEILEDER_FEILET',
        })
    });

    it("Skal ha en hentVeileder()-funksjon som returnerer riktig action", () => {
        const action = {
            overrideveiledersaga: false,
        };
        const res = actions.hentVeileder(action);
        expect(res).to.deep.equal({
            data: {
                overrideveiledersaga: false,
            },
            type: 'HENT_VEILEDER_FORESPURT',
        })
    });

    it("Skal ha en veilderHentet()-funksjon som returnerer riktig action", () => {
        const res = actions.veilederHentet({ veileder: 'en veileder' });
        expect(res).to.deep.equal({
            type: 'VEILEDER_HENTET',
            data: {
                veileder: 'en veileder',
            },
        });
    });
});
