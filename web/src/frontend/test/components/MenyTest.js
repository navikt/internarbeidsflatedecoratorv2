import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Meny from '../../js/components/Meny';

describe("Meny", () => {
    let fnr;
    let egendefinerteLenker;
    let apen;

    beforeEach(() => {
        egendefinerteLenker = {
            lenker: [
                [`/egendef/${fnr}`, 'Den første egendefinerte lenka'],
                ['/enannenegendef', 'Den andre egendefinerte lenka'],
            ],
        };
        fnr = '01234567890';
        apen = true;
    });

    it("Viser default lenker dersom egendefinerteLenker ikke er satt", () => {
        const props = {
            fnr,
            egendefinerteLenker: null,
            apen
        };
        const combo = shallow(<Meny {...props} />);
        expect(combo.text()).to.contain("Mine dialogmøter");
        expect(combo.text()).to.contain("Modia");
    });

    it("Viser egendefinerteLenker dersom disse er satt", () => {
        const props = {
            fnr,
            egendefinerteLenker,
            apen
        };
        const combo = shallow(<Meny {...props} />);
        expect(combo.text()).to.contain("Den første egendefinerte lenka");
        expect(combo.text()).to.contain("Den andre egendefinerte lenka");
    });
});
