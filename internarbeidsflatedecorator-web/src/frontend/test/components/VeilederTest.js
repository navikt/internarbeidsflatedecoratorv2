import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Veileder from '../../v2Js/components/Veileder';
import { EMDASH } from '../../v2Js/utils/utils';

const LANGT_NAVN = "Are Bjørnson Ibsen Lie Kielland";
const LANGT_NAVN_FORKORTET = "Are B. I. L. K";

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

    it('Navn skal forkortes når det er langt', () => {
        veileder.data.navn = LANGT_NAVN;
        const combo = shallow(<Veileder veileder={veileder} />);
        expect(combo.text()).to.contain(LANGT_NAVN_FORKORTET);
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
