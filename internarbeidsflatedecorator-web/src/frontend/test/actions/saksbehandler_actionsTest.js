import chai from 'chai';
import React from 'react'
import chaiEnzyme from 'chai-enzyme';
import * as actions from '../../v2Js/actions/saksbehandler_actions.js';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("saksbehandler_actions", () => {

    it("Skal ha en hentSaksbehandlerFeilet()-funksjon som returnerer riktig action", () => {
        const res = actions.hentSaksbehandlerFeilet();
        expect(res).to.deep.equal({
            type: 'HENT_SAKSBEHANDLER_FEILET',
        })
    });

    it("Skal ha en hentSaksbehandler()-funksjon som returnerer riktig action", () => {
        const res = actions.hentSaksbehandler();
        expect(res).to.deep.equal({
            type: 'HENT_SAKSBEHANDLER_FORESPURT',
        })
    });

    it("Skal ha en saksbehandlerHentet()-funksjon som returnerer riktig action", () => {
        const res = actions.saksbehandlerHentet({ saksbehandler: 'en saksbehandler' });
        expect(res).to.deep.equal({
            type: 'SAKSBEHANDLER_HENTET',
            data: {
                saksbehandler: 'en saksbehandler',
            },
        });
    });
});
