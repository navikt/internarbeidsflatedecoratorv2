import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Meny, { FunksjonsomradeLenker, AndreSystemerLenker } from '../../js/components/Meny';

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

    describe('FunksjonsomradeLenker', () => {
        const kolonneLenge = [7, 7];
        it('skal ha to kolonner', () => {
            const meny = shallow(<FunksjonsomradeLenker fnr="01234567890" enhet={{enhetId: ''}} />);

            const kolonner = meny.find('section.dekorator__kolonne');

            expect(meny.find('.dekorator__kolonner')).to.have.length(1);
            expect(kolonner).to.have.length(2);

            kolonner.forEach((kolonne, index) => {
                const header = kolonne.find('.dekorator__lenkeheader');
                const liste = kolonne.find('.dekorator__menyliste');
                const lenker = kolonne.find('.dekorator__menylenke');

                expect(header).to.have.length(1);
                expect(liste).to.have.length(1);
                expect(lenker).to.have.length(kolonneLenge[index]);

                expect(header.type()).to.equal('h2');
                expect(liste.type()).to.equal('ul');
            });
        });
    });

    describe('AndreSystemerLenker', () => {
        it('skal ha riktig antall lenker', () => {
            const meny = shallow(<AndreSystemerLenker fnr="01234567890" enhet={{enhetId: ''}} />);
            const lenker = meny.find('.dekorator__menylenke');

            expect(lenker).to.have.length(4);
        });
    });
});
