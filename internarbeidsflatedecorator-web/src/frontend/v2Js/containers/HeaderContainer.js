import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import * as saksbehandlerActions from '../actions/saksbehandler_actions';
import * as enheterActions from '../actions/enheter_actions';

export function mapStateToProps(state, ownProps) {
    return {
        saksbehandler: {
            data: state.saksbehandler.data,
            henter: state.saksbehandler.henter,
            hentingFeilet: state.saksbehandler.hentingFeilet,
        },
        enheter: {
            data: state.enheter.data,
            henter: state.enheter.henter,
            hentingFeilet: state.enheter.hentingFeilet,
        },
        toggles: ownProps.config.toggles,
        fnr: ownProps.config.fnr,
        applicationName: ownProps.config.applicationName,
    };
}

const HeaderContainer = connect(mapStateToProps, Object.assign({}, saksbehandlerActions, enheterActions))(Header);

export default HeaderContainer;
