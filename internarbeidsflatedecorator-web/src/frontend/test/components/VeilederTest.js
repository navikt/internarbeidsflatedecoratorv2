import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Veileder from '../../v2Js/components/Veileder';
import { EMDASH } from '../../v2Js/utils/utils';

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

    it("Skal vise ingenting mens dataene hentes", () => {
        veileder.henter = true;
        const combo = shallow(<Veileder veileder={veileder} />);
        expect(combo.text()).to.contain("");
    });

    it("Skal vise feiltekst dersom henting feilet", () => {
        veileder.hentingFeilet = true;
        const combo = shallow(<Veileder veileder={veileder} />);
        expect(combo.text()).to.contain(EMDASH);
    });
});
