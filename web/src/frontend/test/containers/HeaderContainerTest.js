import React from 'react';
import { expect } from 'chai';
import { mapStateToProps } from '../../js/containers/HeaderContainer';
import veileder from '../../js/reducers/veileder';
import enheter from '../../js/reducers/enheter';
import velgenhet from '../../js/reducers/enheter';
import meny from '../../js/reducers/meny';
import feilmelding from '../../js/reducers/feilmelding';

describe("HeaderContainer - mapStateToProps", () => {
    let state = {};
    let ownProps = {
        config: {
            toggles: [],
        }
    };

    beforeEach(() => {
        state.veileder = veileder();
        state.enheter = enheter();
        state.meny = meny();
        state.feilmeldinger = feilmelding();
    });

    it("Fletter veileder data sammen til et enklere objekt som settes på props", () => {
        const props = mapStateToProps(state, ownProps);
        expect(props.veileder).to.deep.equal({
            henter: false,
            hentingFeilet: false,
            data: {},
        });
    });

    it("Fletter enheter data sammen til et enklere objekt som settes på props", () => {
        const props = mapStateToProps(state, ownProps);
        expect(props.enheter).to.deep.equal({
            henter: false,
            hentingFeilet: false,
            data: [],
            valgtEnhet: 'ikke_valgt',
        });
    });
});
