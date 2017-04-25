import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import EnhetVelger from '../../js/components/EnhetVelger';
import sinon from 'sinon';

describe("EnhetVelger", () => {
    let enheter;
    let handleChangeEnhet;

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
        handleChangeEnhet = '0002 NAV Drammen';
    });

    it("Hvis det bare er en enhet vises denne", () => {
        const handleChangeEnhet = sinon.spy();
        const combo = shallow(<EnhetVelger handleChangeEnhet={handleChangeEnhet} enheter={enheter} />);
        expect(combo.text()).to.contain("0001 NAV Oslo");
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
