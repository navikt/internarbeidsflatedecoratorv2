import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Enhet from '../../v2Js/components/Enhet';

import { EMDASH } from '../../v2Js/utils/utils';

describe("Enhet", () => {
    let enheter;

    beforeEach(() => {
        enheter = {
            data: {
                enhetliste: [
                    {
                        navn: 'NAV Oslo'
                    }
                ]
            },
            henter: false,
            hentingFeilet: false,
        }
    });

    it("Skal vise enhetens navn", () => {
        const combo = shallow(<Enhet enheter={enheter} />);
        expect(combo.text()).to.contain("NAV Oslo");
    });

    it("Skal vise ingenting mens dataene hentes", () => {
        enheter.henter = true;
        const combo = shallow(<Enhet enheter={enheter} />);
        expect(combo.text()).to.contain("");
    });

    it("Skal vise feiltekst dersom henting feilet", () => {
        enheter.hentingFeilet = true;
        const combo = shallow(<Enhet enheter={enheter} />);
        expect(combo.text()).to.contain(EMDASH);
    });
});
