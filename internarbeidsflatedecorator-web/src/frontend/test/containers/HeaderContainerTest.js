import React from 'react';
import { expect } from 'chai';
import { mapStateToProps } from '../../v2Js/containers/HeaderContainer';
import veileder from '../../v2Js/reducers/veileder';
import enheter from '../../v2Js/reducers/enheter';
import meny from '../../v2Js/reducers/meny';
import feilmelding from '../../v2Js/reducers/feilmelding';

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
        });
    });
});
