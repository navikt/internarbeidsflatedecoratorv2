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

    return (
        <input id="js-deokorator-sokefelt" onKeyUp={sokefeltEndret} className="dekorator__sokefelt__input" placeholder="Personsøk" type="search" />
    );
};

export default Sokefelt;
