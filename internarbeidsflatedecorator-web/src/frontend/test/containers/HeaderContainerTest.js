import React from 'react';
import { expect } from 'chai';
import { mapStateToProps } from '../../v2Js/containers/HeaderContainer';
import saksbehandler from '../../v2Js/reducers/saksbehandler';
import enheter from '../../v2Js/reducers/enheter';
import meny from '../../v2Js/reducers/meny';

describe("HeaderContainer - mapStateToProps", () => {
    let state = {};
    let ownProps = {
        config: {
            toggles: [],
        }
    };

    beforeEach(() => {
        state.saksbehandler = saksbehandler();
        state.enheter = enheter();
        state.meny = meny();
    });

    it("Fletter saksbehandler data sammen til et enklere objekt som settes på props", () => {
        const props = mapStateToProps(state, ownProps);
        expect(props.saksbehandler).to.deep.equal({
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
