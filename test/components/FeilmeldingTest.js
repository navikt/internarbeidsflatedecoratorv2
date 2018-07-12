import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Feilmelding from '../../js/components/Feilmelding';

describe("Feilmelding", () => {

    it("Skal vise feilemdling", () => {
        const feilmelding = "Feil i baksystem";
        const combo = shallow(<Feilmelding feilmelding={feilmelding} />);
        expect(combo.text()).to.contain(feilmelding);
    });
});
