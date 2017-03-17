import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Enhet from '../../v2Js/components/Enhet';

describe("Enhet", () => {
    let enheter;

    beforeEach(() => {
        enheter = {
            data: {
                navn: 'NAV Oslo'
            },
            henter: false,
            hentingFeilet: false,
        }
    });

    it("Skal vise enhetens navn", () => {
        const combo = shallow(<Enhet enheter={enheter} />);
        expect(combo.text()).to.contain("NAV Oslo");
    });
});
