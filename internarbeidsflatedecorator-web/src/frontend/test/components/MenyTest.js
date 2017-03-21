import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Meny from '../../v2Js/components/Meny';

describe("Meny", () => {
    let fnr;
    let egendefinerteLenker;

    beforeEach(() => {
        egendefinerteLenker = {
            lenker: [
                [`/egendef/${fnr}`, 'Den første egendefinerte lenka'],
                ['/enannenegendef', 'Den andre egendefinerte lenka'],
            ],
        };
        fnr = '01234567890';
    });

    it("Viser default lenker dersom egendefinerteLenker ikke er satt", () => {
        const combo = shallow(<Meny />);
        expect(combo.text()).to.contain("Mine dialogmøter");
        expect(combo.text()).to.contain("Modia");
    });

    it("Viser egendefinerteLenker dersom disse er satt", () => {
        const combo = shallow(<Meny egendefinerteLenker={egendefinerteLenker} />);
        expect(combo.text()).to.contain("Den første egendefinerte lenka");
        expect(combo.text()).to.contain("Den andre egendefinerte lenka");
    });
});
