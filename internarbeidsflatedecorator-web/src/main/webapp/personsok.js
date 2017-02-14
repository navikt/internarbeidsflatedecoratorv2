(function () {
    var sokefelt = document.getElementById("js-deokorator-sokefelt");
    var valideringslinje = document.getElementById("js-dekorator-feilmelding");
    var valideringslinjeTekst = document.getElementById("js-dekorator-feilmelding-tekst");
    var ERROR_CLASS = 'dekorator__sokefelt__valideringsfeil';
    var ERROR_BANNER_CLASS = 'dekorator__feilmelding__banner';

    var DEFAULT_FEILMELDING = 'Personnummeret må inneholde 11 siffer';
    var FOR_FAA_TEGN_FEILMELDING = DEFAULT_FEILMELDING;
    var FOR_MANGE_TEGN_FEILMELDING = 'Personnummeret må inneholde kun 11 siffer';
    var IKKE_BARE_TALL_FEILMELDING = 'Personnummeret må kun inneholde tall';
    var IKKE_GYLDIG_KONTROLLSIFFER_FEILMELDING = 'Personnummeret er ikke gyldig';


    function triggerPersonsokEvent(personnummer) {
        var personsokEvent = new Event('dekorator-hode-personsok');
        personsokEvent.personnummer = personnummer;
        document.dispatchEvent(personsokEvent);
    }

    function lagPersonnummerfeilmelding (input) {
        if (!input.match(/^\d+$/)) {
            return IKKE_BARE_TALL_FEILMELDING;
        } else if (input.length > 11) {
            return FOR_MANGE_TEGN_FEILMELDING;
        } else if (input.length < 11) {
            return FOR_FAA_TEGN_FEILMELDING;
        }
        return null;
    }

    function markerSomGyldig() {
        sokefelt.classList.remove(ERROR_CLASS);
        if (valideringslinje) {
            valideringslinje.classList.remove(ERROR_BANNER_CLASS);
        }
    }

    function markerSomFeil(feilmelding) {
        sokefelt.classList.add(ERROR_CLASS);
        if (valideringslinje) {
            if (valideringslinjeTekst) {
                valideringslinjeTekst.textContent = feilmelding || DEFAULT_FEILMELDING;
            }
            valideringslinje.classList.add(ERROR_BANNER_CLASS);
        }
    }

    function validerInput (event) {
        var inputfelt = event.target;
        var feilmelding  = lagPersonnummerfeilmelding(inputfelt.value);
        if (feilmelding) {
            markerSomFeil(feilmelding);
            return false;
        } else {
            markerSomGyldig();
            return true;
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
