import { connect } from 'react-redux';
import Header from '../components/Header';
import * as aktorActions from '../actions/aktor_actions';
import * as veilederActions from '../actions/veileder_actions';
import * as enheterActions from '../actions/enheter_actions';
import * as menyActions from '../actions/meny_actions';
import * as settValgtEnhetActions from '../actions/valgtenhet_actions';

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
        valgtEnhet: state.valgtEnhet.valgtEnhet,
        extraMarkup: ownProps.config.extraMarkup,
        toggles: ownProps.config.toggles,
        applicationName: ownProps.config.applicationName,
        handleChangeEnhet: ownProps.config.handleChangeEnhet,
        fnr: ownProps.config.fnr,
        aktorId: {
            data: state.aktor.data,
            henter: state.aktor.henter,
            hentingFeilet: state.aktor.hentingFeilet,
        },
        autoSubmit: ownProps.config.autoSubmit,
        visMeny: state.meny.visMeny,
        feilmelding: state.feilmeldinger.feilmelding,
        handlePersonsokSubmit: ownProps.config.handlePersonsokSubmit,
    };
}

export default connect(mapStateToProps, Object.assign({}, veilederActions, enheterActions, aktorActions, menyActions, settValgtEnhetActions))(Header);
