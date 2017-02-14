(function () {
    var sokefelt = document.getElementById("js-deokorator-sokefelt");
    var valideringslinje = document.getElementById("js-dekorator-feilmelding");
    var ERROR_CLASS = 'dekorator__sokefelt__valideringsfeil';
    var ERROR_BANNER_CLASS = 'dekorator__feilmelding__banner';

    function triggerPersonsokEvent(personnummer) {
        var personsokEvent = new Event('dekorator-hode-personsok');
        personsokEvent.personnummer = personnummer;
        document.dispatchEvent(personsokEvent);
    }

    function inputErGyldigPersonnummer (input) {
        return input.match(/^\d+$/) && input.length === 11;
    }

    function markerSomGyldig() {
        sokefelt.classList.remove(ERROR_CLASS);
        if (valideringslinje) {
            valideringslinje.classList.remove(ERROR_BANNER_CLASS);
        }
    }

    function markerSomFeil() {
        sokefelt.classList.add(ERROR_CLASS);
        if (valideringslinje) {
            valideringslinje.classList.add(ERROR_BANNER_CLASS);
        }
    }

    function validerInput (event) {
        const inputfelt = event.target;
        if (inputErGyldigPersonnummer(inputfelt.value)) {
            markerSomGyldig();
            return true;
        } else {
            markerSomFeil();
            return false;
        }
    }

    function fjernSoketekst() {
        sokefelt.value = '';
    }

    if (sokefelt) {
        sokefelt.addEventListener("keyup", function (event) {
            var ENTER_KEY_CODE = 13;
            if (event.keyCode === ENTER_KEY_CODE) {
                if (validerInput(event)) {
                    triggerPersonsokEvent(event.target.value);
                    fjernSoketekst();
                }
            } else {
                markerSomGyldig(event.input);
            }
        });
    }
})();
