import React from 'react';
import { createStore } from 'redux';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Header from '../../js/components/Header';
import { Provider } from 'react-redux';
import Enhet from '../../js/components/Enhet';
import Veileder from '../../js/components/Veileder';
import Sokefelt from '../../js/containers/SokefeltContainer';
import EnhetVelger from '../../js/components/EnhetVelger';
import Feilmelding from '../../js/components/Feilmelding';
import veileder from '../../js/reducers/veileder';
import enheter from '../../js/reducers/enheter';
import { combineReducers } from 'redux';
import meny from '../../js/reducers/meny';
import feilmeldinger from '../../js/reducers/feilmelding';
import valgtEnhet from '../../js/reducers/valgtenhet';
import aktor from '../../js/reducers/aktor';
import mockEnheter from '../../js/sagas/mock/enheter';
import veilederMock from '../../js/sagas/mock/veileder';

export const rootReducer = combineReducers({
    veileder,
    enheter,
    aktor,
    meny,
    feilmeldinger,
    valgtEnhet,
});
const store = createStore(rootReducer);
function HeaderWrapper(props) {
    return <Provider store={ store }><Header { ...props } /></Provider>;
}


describe("Header", () => {
    let toggles;
    let mockVeileder = {
        data: veilederMock,
    }
    let mockEnhetsliste = {
        data: mockEnheter,
    }
    beforeEach(() => {
        toggles = {
            visVeileder: false,
            visSokefelt: false,
            visEnhetVelger: false,
            visEnhet: false,
        }
    });

    it("visEnhet satt til true renderer Enhet", () => {
        toggles.visEnhet = true;
        const combo = mount(<HeaderWrapper toggles={toggles} enheter={mockEnhetsliste} />);
        expect(combo.find(Enhet)).to.have.length(1);
        expect(combo.find(Veileder)).to.have.length(0);
        expect(combo.find(EnhetVelger)).to.have.length(0);
        expect(combo.find(Sokefelt)).to.have.length(0);
    });

    it("visVeileder satt til true renderer Veileder", () => {
        toggles.visVeileder = true;
        const combo = mount(<HeaderWrapper toggles={toggles} veileder={mockVeileder} />);
        expect(combo.find(Enhet)).to.have.length(0);
        expect(combo.find(Veileder)).to.have.length(1);
        expect(combo.find(EnhetVelger)).to.have.length(0);
        expect(combo.find(Sokefelt)).to.have.length(0);
    });

    it("visEnhetVelger satt til true renderer EnhetVelger", () => {
        toggles.visEnhetVelger = true;
        const combo = mount(<HeaderWrapper toggles={toggles} enheter={mockEnhetsliste} />);
        expect(combo.find(Enhet)).to.have.length(0);
        expect(combo.find(Veileder)).to.have.length(0);
        expect(combo.find(EnhetVelger)).to.have.length(1);
        expect(combo.find(Sokefelt)).to.have.length(0);
    });

    it("visSokefelt satt til true renderer Sokefelt", () => {
        toggles.visSokefelt = true;
        const combo = mount(<HeaderWrapper toggles={toggles} />);
        expect(combo.find(Enhet)).to.have.length(0);
        expect(combo.find(Veileder)).to.have.length(0);
        expect(combo.find(EnhetVelger)).to.have.length(0);
        expect(combo.find(Sokefelt)).to.have.length(1);
    });

    it("viser feilmelding dersom den er satt til noe", () => {
        const feilmelding = "feilmelding";
        const combo = mount(<HeaderWrapper feilmelding={feilmelding} />);
        expect(combo.find(Feilmelding)).to.have.length(1);
    });

    it("viser ikke feilmelding dersom den ikke er satt til noe", () => {
        const combo = mount(<HeaderWrapper />);
        expect(combo.find(Feilmelding)).to.have.length(0);
    });
});