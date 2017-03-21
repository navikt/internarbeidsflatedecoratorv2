import React, { PropTypes } from 'react';

import { erGyldigPersonnummer, lagPersonnummerfeilmelding } from '../utils/fodselsnummer';

const triggerPersonsokEvent = fodselsnummer => {
    const personsokEvent = document.createEvent('Event');
    personsokEvent.initEvent('dekorator-hode-personsok', true, true);
    personsokEvent.personnummer = fodselsnummer;
    document.dispatchEvent(personsokEvent);
};

const Sokefelt = ({visFeilmelding, fjernFeilmelding}) => {

    const fjernSoketekst = () => {
        document.getElementById("js-deokorator-sokefelt").value = '';
    };

    const onEnter = fodselsnummer => {
        if (erGyldigPersonnummer(fodselsnummer)) {
            triggerPersonsokEvent(fodselsnummer);
            fjernSoketekst();
        } else {
            visFeilmelding(lagPersonnummerfeilmelding(fodselsnummer));
        }
    };

    const sokefeltEndret = (event) => {
        const ENTER_KEY_CODE = 13;
        if (event.keyCode === ENTER_KEY_CODE) {
            const input = event.target.value.replace(/\s/g, '');
            onEnter(input);
        } else {
            fjernFeilmelding();
        }
    };

    const onSubmit = event => {
        event.preventDefault();
        sokefeltEndret(event);
    };

    return (
        <form className="dekorator__sokefelt" onSubmit={onSubmit}>
            <input id="js-deokorator-sokefelt" onKeyUp={sokefeltEndret} className="dekorator__sokefelt__input" placeholder="Personsøk" type="search" />
            <img id="forstorrelsesglass_sokefelt" className="dekorator__sokefelt__forstorrelsesglass dekorator__forstorrelsesglass__hvit" />
        </form>
    );
};

export default Sokefelt;
