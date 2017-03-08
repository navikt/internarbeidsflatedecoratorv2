import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import * as saksbehandlerActions from '../actions/saksbehandler_actions';

class HeaderSide extends Component {
    render() {
        const { henter, hentingFeilet, saksbehandler } = this.props;
        return <Header />
    }
}

HeaderSide.propTypes = {
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    saksbehandler: PropTypes.shape({
        navn: PropTypes.string,
        ident: PropTypes.string,
    }),
};

export function mapStateToProps(state) {
    console.log(state);
    return {
        henter: state.saksbehandler.henter,
        hentingFeilet: state.saksbehandler.hentingFeilet,
        saksbehandler: state.saksbehandler.data,
    };
}

const HeaderContainer = connect(mapStateToProps, Object.assign({}, saksbehandlerActions))(Header);

export default HeaderContainer;
