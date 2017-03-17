import { connect } from 'react-redux';
import Header from '../components/Header';
import * as saksbehandlerActions from '../actions/saksbehandler_actions';
import * as enheterActions from '../actions/enheter_actions';
import * as menyActions from '../actions/meny_actions';

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
        applicationName: ownProps.config.applicationName,
        handleChangeEnhet: ownProps.config.handleChangeEnhet,
        egendefinerteLenker: ownProps.config.egendefinerteLenker,
        initiellEnhet: ownProps.config.initiellEnhet,
        fnr: ownProps.config.fnr,
        visMeny: state.meny.visMeny,
    };
}

export default connect(mapStateToProps, Object.assign({}, saksbehandlerActions, enheterActions, menyActions))(Header);
