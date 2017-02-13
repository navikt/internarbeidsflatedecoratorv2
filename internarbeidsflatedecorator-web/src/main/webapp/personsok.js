(function () {
    var sokefelt = document.getElementById("js-deokorator-sokefelt");
    var valideringslinje = document.getElementById("js-dekorator-feilmelding");
    const ERROR_CLASS = 'error';

    function triggerPersonsokEvent(personnummer) {
        var personsokEvent = new Event('dekorator-hode-personsok');
        personsokEvent.personnummer = personnummer;
        document.dispatchEvent(personsokEvent);
    }

    function inputErGyldig (input) {
        return input.match(/^\d*$/) && input.length <= 11;
    }

    function inputErGyldigPersonnummer (input) {
        return input.match(/^\d+$/) && input.length === 11;
    }

    function validerInput (event) {
        const inputfelt = event.target;
        if (inputErGyldig(inputfelt.value)) {
            inputfelt.classList.remove(ERROR_CLASS);
            if (valideringslinje) {
                valideringslinje.classList.remove('feilmeldingbanner');
            }
            console.log(inputfelt.classList);
            console.log('Riktig');
            if (inputErGyldigPersonnummer(inputfelt.value)) {
                console.log('Gyldig');
            }
        } else {
            inputfelt.classList.add(ERROR_CLASS);
            valideringslinje.classList.add('feilmeldingbanner');
            console.log('Feil');
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
