import { connect } from 'react-redux';
import Header from '../components/Header';
import * as veilederActions from '../actions/veileder_actions';
import * as enheterActions from '../actions/enheter_actions';
import * as menyActions from '../actions/meny_actions';

export function mapStateToProps(state, ownProps) {
    return {
        veileder: {
            data: state.veileder.data,
            henter: state.veileder.henter,
            hentingFeilet: state.veileder.hentingFeilet,
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
        valgtEnhet: state.enhetvelger.enhet,
        feilmelding: state.feilmeldinger.feilmelding,
    };
}

export default connect(mapStateToProps, Object.assign({}, veilederActions, enheterActions, menyActions))(Header);
