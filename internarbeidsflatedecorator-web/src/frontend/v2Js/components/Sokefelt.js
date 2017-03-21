import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { erGyldigPersonnummer, lagPersonnummerfeilmelding } from '../utils/fodselsnummer';

const triggerPersonsokEvent = fodselsnummer => {
    const personsokEvent = document.createEvent('Event');
    personsokEvent.initEvent('dekorator-hode-personsok', true, true);
    personsokEvent.personnummer = fodselsnummer;
    document.dispatchEvent(personsokEvent);
};

class Sokefelt extends React.Component {

    fjernSoketekst = () => {
        document.getElementById("js-deokorator-sokefelt").value = '';
    };

    onEnter = (fodselsnummer) => {
        if (erGyldigPersonnummer(fodselsnummer)) {
            triggerPersonsokEvent(fodselsnummer);
            this.fjernSoketekst();
        } else {
            this.props.visFeilmelding(lagPersonnummerfeilmelding(fodselsnummer));
            this.setState({valideringsfeil: true});
        }
    };

    sokefeltEndret = (event) => {
        const ENTER_KEY_CODE = 13;
        if (event.keyCode === ENTER_KEY_CODE) {
            const input = event.target.value.replace(/\s/g, '');
            this.onEnter(input);
        } else {
            this.props.fjernFeilmelding();
            this.setState({valideringsfeil: false});
        }
    };

    onSubmit = (event) => {
        event.preventDefault();
        this.sokefeltEndret(event);
    };

    render() {
        const sokefeltKlasser = classNames({
            dekorator__sokefelt__input: true,
            dekorator__sokefelt__valideringsfeil: this.state.valideringsfeil
        });
        return (
            <form className="dekorator__sokefelt" onSubmit={this.onSubmit}>
                <input id="js-deokorator-sokefelt" onKeyUp={this.sokefeltEndret} className={sokefeltKlasser} placeholder="Personsøk" type="search" />
                <img id="forstorrelsesglass_sokefelt" className="dekorator__sokefelt__forstorrelsesglass dekorator__forstorrelsesglass__hvit" />
            </form>
        );
    }
}

export default Sokefelt;
