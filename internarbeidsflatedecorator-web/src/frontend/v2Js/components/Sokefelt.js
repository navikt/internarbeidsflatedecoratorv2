import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { erGyldigFodselsnummer, lagFodselsnummerfeilmelding } from '../utils/fodselsnummer';

class Sokefelt extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            valideringsfeil: false,
        };
    }

    onEnter = (fodselsnummer) => {
        if (erGyldigFodselsnummer(fodselsnummer)) {
            this.props.triggerPersonsokEvent(fodselsnummer);
            this.fjernSoketekst();
        } else {
            this.props.visFeilmelding(lagFodselsnummerfeilmelding(fodselsnummer));
            this.setState(...this.state, { valideringsfeil: true });
        }
    };

    onSubmit = (event) => {
        event.preventDefault();
        const input = this.state.value.replace(/\s/g, '');
        this.onEnter(input);
    };

    sokefeltEndret = (event) => {
        this.setState({
            value: event.target.value,
        });

        this.props.fjernFeilmelding();
        this.setState({ valideringsfeil: false });
    };

    fjernSoketekst = () => {
        this.setState({
            value: '',
        });
    };

    render() {
        const sokefeltKlasser = classNames({
            dekorator__sokefelt__input: true,
            dekorator__sokefelt__valideringsfeil: this.state.valideringsfeil,
        });

        return (
            <form className="dekorator__sokefelt" onSubmit={this.onSubmit}>
                <input id="js-deokorator-sokefelt"
                    onChange={this.sokefeltEndret}
                    className={sokefeltKlasser}
                    placeholder="Personsøk"
                    type="search"
                    value={this.state.value}
                />
                <img id="forstorrelsesglass_sokefelt" className="dekorator__sokefelt__forstorrelsesglass dekorator__forstorrelsesglass__hvit" />
            </form>
        );
    }
}

Sokefelt.propTypes = {
    triggerPersonsokEvent: PropTypes.func,
    visFeilmelding: PropTypes.func,
    fjernFeilmelding: PropTypes.func,
};

export default Sokefelt;
