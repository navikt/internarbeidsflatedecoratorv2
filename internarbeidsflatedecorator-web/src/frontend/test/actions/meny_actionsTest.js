import chai from 'chai';
import React from 'react'
import chaiEnzyme from 'chai-enzyme';
import * as actions from '../../v2Js/actions/meny_actions.js';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("meny_actions", () => {

    it("Skal ha en toggleMeny()-funksjon som returnerer riktig action", () => {
        const res = actions.toggleMeny();
        expect(res).to.deep.equal({
            type: 'TOGGLE_MENY',
        })
    });
});
