import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import EnhetVelger from '../../v2Js/components/EnhetVelger';

describe("Saksbehandler", () => {
    let enheter;
    let initiellEnhet;

    beforeEach(() => {
        enheter = {
            data: {
                enhetliste: [
                    { navn: 'NAV Oslo', enhetId: '0001' }
                ]
            },
            henter: false,
            hentingFeilet: false,
        };
        initiellEnhet = {
            navn: 'NAV Drammen',
            enhetId: '0002',
        }
    });

    it("Hvis det bare er en enhet vises denne", () => {
        const combo = shallow(<EnhetVelger enheter={enheter} />);
        expect(combo.text()).to.contain("0001 NAV Oslo");
    });

    it("Hvis det er flere enheter vises en select med intitellEnhet som valgt", () => {
        enheter =  {
            data: {
                enhetliste: [
                    { navn: 'NAV Oslo', enhetId: '0001' },
                    { navn: 'NAV Drammen', enhetId: '0002' },
                ]
            },
            henter: false,
            hentingFeilet: false,
        };
        const combo = shallow(<EnhetVelger enheter={enheter} initiellEnhet={initiellEnhet} />);
        expect(combo.find(".dekorator-select-container")).to.have.length(1);
        expect(combo.find('select')).to.have.length(1);
        expect(combo.find("select").prop("value")).to.equal("0002 NAV Drammen");
        expect(combo.text()).to.contain("0001 NAV Oslo");
        expect(combo.text()).to.contain("0002 NAV Drammen");
    });

    it("Skal vise henter når mens dataene hentes", () => {
        enheter.henter = true;
        const combo = shallow(<EnhetVelger enheter={enheter} />);
        expect(combo.text()).to.contain("Henter...");
    });

    it("Skal vise feiltekst dersom henting feilet", () => {
        enheter.hentingFeilet = true;
        const combo = shallow(<EnhetVelger enheter={enheter} />);
        expect(combo.text()).to.contain("Kunne ikke hente enheter");
    });
});
