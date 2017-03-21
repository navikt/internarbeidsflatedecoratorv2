import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import Sokefelt from '../../v2Js/components/Sokefelt';

const GYLDIG_FODSELSNUMMER = '***REMOVED***';
const UGYLDIG_FODSELSNUMMER = '***REMOVED***';
const ENTER_KEY_CODE = 13;
const IKKE_ENTER_KEY_CODE = 12;

describe("Sokefelt", () => {

    it("Skal vise sokefelt", () => {
        const combo = shallow(<Sokefelt />);
        expect(combo.find(".dekorator__sokefelt")).to.have.length(1);
    });

    it("Skal fjerne feilmelding ved tastetrykk i søkefeltet", () => {
        const fjernFeilmelding = sinon.spy();
        const wrapper = shallow(<Sokefelt fjernFeilmelding={fjernFeilmelding} />);

        wrapper.find('.dekorator__sokefelt__input').simulate('keyUp', {
            keyCode : IKKE_ENTER_KEY_CODE,
            target: {
                value: "a"
            }
        });

        expect(fjernFeilmelding).to.have.property('callCount', 1);
    });

    it("Skal dispatche event ved entertrykk på gyldige fødselsnummer", () => {
        const triggerPersonsokEvent = sinon.spy();
        const fjernFeilmelding = sinon.spy();

        const wrapper = shallow(<Sokefelt triggerPersonsokEvent={triggerPersonsokEvent} fjernFeilmelding={fjernFeilmelding} />);
        const ENTER_KEY_CODE = 13;

        wrapper.find('.dekorator__sokefelt__input').simulate('keyUp', {
            keyCode : ENTER_KEY_CODE,
            target : {
                value: GYLDIG_FODSELSNUMMER
            }
        });

        expect(triggerPersonsokEvent).to.have.property('callCount', 1);
    });

    it("Skal vise feilmelding ved entertrykk på ugyldige fødselsnummer", () => {
        const triggerPersonsokEvent = sinon.spy();
        const fjernFeilmelding = sinon.spy();
        const visFeilmelding = sinon.spy();

        const wrapper = shallow(
            <Sokefelt triggerPersonsokEvent={triggerPersonsokEvent}
                      fjernFeilmelding={fjernFeilmelding}
                      visFeilmelding={visFeilmelding}
            />);

        wrapper.find('.dekorator__sokefelt__input').simulate('keyUp', {
            keyCode: ENTER_KEY_CODE,
            target: {
                value: UGYLDIG_FODSELSNUMMER
            }
        });

        expect(visFeilmelding).to.have.property('callCount', 1);
    });

    it('Skal kalle preventDefault ved submit', () => {
        const triggerPersonsokEvent = sinon.spy();
        const fjernFeilmelding = sinon.spy();
        const visFeilmelding = sinon.spy();
        const defaultSpy = sinon.spy();
        const wrapper = shallow(
            <Sokefelt triggerPersonsokEvent={triggerPersonsokEvent}
                      fjernFeilmelding={fjernFeilmelding}
                      visFeilmelding={visFeilmelding}
            />);

        wrapper.find('.dekorator__sokefelt').simulate('submit', {
            preventDefault: defaultSpy,
            keyCode: IKKE_ENTER_KEY_CODE,
            target: {
                value: GYLDIG_FODSELSNUMMER
            }
        });

        expect(defaultSpy).to.have.property('callCount', 1);
    });

});
