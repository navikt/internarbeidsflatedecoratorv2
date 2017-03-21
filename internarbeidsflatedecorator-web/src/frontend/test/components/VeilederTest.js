import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Veileder from '../../v2Js/components/Veileder';

describe("Veileder", () => {
    let veileder;

    beforeEach(() => {
        veileder = {
            data: {
                navn: 'Vegard Veileder',
                ident: 'Z999999',
            },
            henter: false,
            hentingFeilet: false,
        }
    });

    it("Skal vise veileders navn og ident", () => {
        const combo = shallow(<Veileder veileder={veileder} />);
        expect(combo.text()).to.contain("Vegard Veileder");
        expect(combo.text()).to.contain("(Z999999)");
    });

    it("Skal vise henter når mens dataene hentes", () => {
        veileder.henter = true;
        const combo = shallow(<Veileder veileder={veileder} />);
        expect(combo.text()).to.contain("Henter...");
    });

    it("Skal vise feiltekst dersom henting feilet", () => {
        veileder.hentingFeilet = true;
        const combo = shallow(<Veileder veileder={veileder} />);
        expect(combo.text()).to.contain("Henting av veilederdata feilet");
    });
});
