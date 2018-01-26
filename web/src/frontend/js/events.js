export function dispatchPersonsokEvent(fodselsnummer) {
    const personsokEvent = document.createEvent('Event');
    personsokEvent.initEvent('dekorator-hode-personsok', true, true);
    personsokEvent.fodselsnummer = fodselsnummer;
    document.dispatchEvent(personsokEvent);
}

export function dispatchFjernPersonEvent() {
    const personsokEvent = document.createEvent('Event');
    personsokEvent.initEvent('dekorator-hode-fjernperson', true, true);
    document.dispatchEvent(personsokEvent);
}

export function setFokusSokefelt() {
    const sokefelt = document.getElementById('js-deokorator-sokefelt');
    if (sokefelt) {
        sokefelt.focus();
        sokefelt.select();
    }
}
