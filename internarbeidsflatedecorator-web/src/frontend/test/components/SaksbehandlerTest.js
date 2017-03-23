import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Saksbehandler from '../../v2Js/components/Saksbehandler';

describe("Saksbehandler", () => {
    let saksbehandler;

    beforeEach(() => {
        saksbehandler = {
            data: {
                navn: 'Vegard Veileder',
                ident: 'Z999999',
            },
            henter: false,
            hentingFeilet: false,
        }
    });

    it("Skal vise saksbehandlers navn og ident", () => {
        const combo = shallow(<Saksbehandler saksbehandler={saksbehandler} />);
        expect(combo.text()).to.contain("Vegard Veileder");
        expect(combo.text()).to.contain("(Z999999)");
    });

    it("Skal vise henter når mens dataene hentes", () => {
        saksbehandler.henter = true;
        const combo = shallow(<Saksbehandler saksbehandler={saksbehandler} />);
        expect(combo.text()).to.contain("Henter...");
    });

    it("Skal vise feiltekst dersom henting feilet", () => {
        saksbehandler.hentingFeilet = true;
        const combo = shallow(<Saksbehandler saksbehandler={saksbehandler} />);
        expect(combo.text()).to.contain("Henting av veilederdata feilet");
    });
});
