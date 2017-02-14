(function () {
    var sokefelt = document.getElementById("js-deokorator-sokefelt");
    var valideringslinje = document.getElementById("js-dekorator-feilmelding");
    const ERROR_CLASS = 'error';
    const ERROR_BANNER_CLASS = 'feilmeldingbanner';

    function triggerPersonsokEvent(personnummer) {
        var personsokEvent = new Event('dekorator-hode-personsok');
        personsokEvent.personnummer = personnummer;
        document.dispatchEvent(personsokEvent);
    }

    function inputErGyldigPersonnummer (input) {
        return input.match(/^\d+$/) && input.length === 11;
    }

    function validerInput (event) {
        const inputfelt = event.target;
        if (inputErGyldigPersonnummer(inputfelt.value)) {
            inputfelt.classList.remove(ERROR_CLASS);
            if (valideringslinje) {
                valideringslinje.classList.remove(ERROR_BANNER_CLASS);
            }
        } else {
            inputfelt.classList.add(ERROR_CLASS);
            valideringslinje.classList.add(ERROR_BANNER_CLASS);
        }
    }

    if (sokefelt) {
        sokefelt.addEventListener("keyup", function (event) {
            var ENTER_KEY_CODE = 13;
            if (event.keyCode === ENTER_KEY_CODE) {
                validerInput(event);
                triggerPersonsokEvent(event.target.value);
            }
        });
    }
})();
