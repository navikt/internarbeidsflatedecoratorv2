import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Meny, { AndreSystemerLenker } from '../../js/components/Meny';

describe("Meny", () => {
    it("Renderer null om lukket", () => {
        const meny = shallow(<Meny fnr="01234567890" />);

        expect(meny.type()).to.equal(null);
    });
    it("Viser lenker om åpen", () => {
        const meny = mount(<Meny fnr="01234567890" enhet={{enhetId: ''}} apen />);

        expect(meny.find('.dekorator__kolonner')).to.have.length(1);
        expect(meny.find('.dekorator__rad')).to.have.length(1);
        expect(meny.find('section')).to.have.length(3);
    });

    describe('AndreSystemerLenker', () => {
        it('skal ha riktig antall lenker', () => {
            const meny = shallow(<AndreSystemerLenker fnr="01234567890" enhet={{enhetId: ''}} />);
            const lenker = meny.find('.dekorator__menylenke');

            expect(lenker).to.have.length(4);
        });
    });
});
