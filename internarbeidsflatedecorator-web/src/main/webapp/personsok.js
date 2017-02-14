(function () {
    var sokefelt = document.getElementById("js-deokorator-sokefelt");
    var valideringslinje = document.getElementById("js-dekorator-feilmelding");
    const ERROR_CLASS = 'dekorator__sokefelt__valideringsfeil';
    const ERROR_BANNER_CLASS = 'dekorator__feilmelding__banner';

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
            return true;
        } else {
            inputfelt.classList.add(ERROR_CLASS);
            if (valideringslinje) {
                valideringslinje.classList.add(ERROR_BANNER_CLASS);
            }
            return false;
        }
    }

    if (sokefelt) {
        sokefelt.addEventListener("keyup", function (event) {
            var ENTER_KEY_CODE = 13;
            if (event.keyCode === ENTER_KEY_CODE) {
                if (validerInput(event)) {
                    triggerPersonsokEvent(event.target.value);
                }
            }
        });
    }
})();
