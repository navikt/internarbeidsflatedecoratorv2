import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Enhet from '../../js/components/Enhet';

import { EMDASH } from '../../js/utils/utils';

const enhetValgt = enhetID => {
    global.location = {
        search: `?enhet=${enhetID}`
    }
};

describe("Enhet", () => {
    let enheter;
    const ENHET_ID_IKKE_I_ENHETLISTE = "6666";
    beforeEach(() => {
        enheter = {
            data: {
                enhetliste: [
                    {
                        id: '0122',
                        navn: 'NAV testenhet1'
                    },
                    {
                        id: '0333',
                        navn: 'NAV Oslo'
                    }
                ]
            },
            henter: false,
            hentingFeilet: false,
        }
    });

    describe("med valgt enhet satt i query", () => {
        it("Skal vise enhetens navn", () => {
            enhetValgt(enheter.data.enhetliste[1].id);
            const combo = shallow(<Enhet enheter={enheter} />);
            expect(combo.text()).to.contain(enheter.data.enhetliste[1].navn);
        });

        it("Skal vise første enhet i enhetslisten hvis valgt enhet ikke finnes i listen", () => {
            enhetValgt(ENHET_ID_IKKE_I_ENHETLISTE);
            const combo = shallow(<Enhet enheter={enheter} />);
            expect(combo.text()).to.contain(enheter.data.enhetliste[0].navn);
        });

    });

    describe("uten valgt enhet satt i query", () => {
        it("Skal vise enhetens først i enhetlisten sitt navn", () => {
            const combo = shallow(<Enhet enheter={enheter} />);
            expect(combo.text()).to.contain(enheter.data.enhetliste[0].navn);
        });
    });

    it("Skal vise ingenting mens enheter hentes fra serveren", () => {
        enheter.henter = true;
        const combo = shallow(<Enhet enheter={enheter} />);
        expect(combo.text()).to.contain("");
    });

    it("Skal vise feiltekst dersom henting fra serveren feilet", () => {
        enheter.hentingFeilet = true;
        const combo = shallow(<Enhet enheter={enheter} />);
        expect(combo.text()).to.contain(EMDASH);
    });
});
