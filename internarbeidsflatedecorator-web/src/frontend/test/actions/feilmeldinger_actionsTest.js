import chai from 'chai';
import React from 'react'
import chaiEnzyme from 'chai-enzyme';
import * as actions from '../../v2Js/actions/feilmeldinger_actions.js';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("feilmeldinger_actions", () => {

    it("Skal ha en visFeilmelding()-funksjon som returnerer riktig action med feilmelding", () => {
        const feilmelding = "Superfeil";

        const res = actions.visFeilmelding(feilmelding);

        expect(res).to.deep.equal({
            type: 'VIS_FEILMELDING',
            data: feilmelding
        })
    });

    it("Skal ha en fjernFeilmelding()-funksjon som returnerer riktig action", () => {
        const res = actions.fjernFeilmelding();
        expect(res).to.deep.equal({
            type: 'FJERN_FEILMELDING',
        })
    });
});
