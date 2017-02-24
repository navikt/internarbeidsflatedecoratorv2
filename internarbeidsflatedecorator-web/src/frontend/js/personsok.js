var DEFAULT_FEILMELDING = 'Personnummeret må inneholde 11 siffer';
var FOR_FAA_TEGN_FEILMELDING = DEFAULT_FEILMELDING;
var FOR_MANGE_TEGN_FEILMELDING = 'Personnummeret må inneholde kun 11 siffer';
var IKKE_BARE_TALL_FEILMELDING = 'Personnummeret må kun inneholde tall';
var IKKE_GYLDIG_KONTROLLSIFFER_FEILMELDING = 'Personnummeret er ikke gyldig';

var kontrollRekke1 = [3, 7, 6, 1, 8, 9, 4, 5, 2];
var kontrollRekke2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

function triggerPersonsokEvent(personnummer) {
    var personsokEvent = document.createEvent('Event');
    personsokEvent.initEvent('dekorator-hode-personsok', true, true);
    personsokEvent.personnummer = personnummer;
    document.dispatchEvent(personsokEvent);
}

function kontrollSiffer(personnummer, kontrollrekke) {
    var sum = 0;
    for (var sifferNummer = 0; sifferNummer < personnummer.length; sifferNummer++) {
        sum += personnummer[sifferNummer] * kontrollrekke[sifferNummer];
    }
    var kontrollSiffer = sum % 11;
    return kontrollSiffer !== 0 ? 11 - kontrollSiffer : 0;
}

function erGyldigPnummer(dag, maaned) {
    return dag > 0 && dag <= 32
        && maaned > 0 && maaned <= 12;
}

function erGyldigDNummer(dag, maaned) {
    return dag > 40 && dag <= 72
        && maaned > 0 && maaned <= 12;
}

function erGyldigHNummer(dag, maaned) {
    return dag > 0 && dag <= 32
        && maaned > 40 && maaned <= 52;
}

function erGyldigFodselsnummer(fodselsnummer) {
    var dag = parseInt(fodselsnummer.substring(0, 2));
    var maaned = parseInt(fodselsnummer.substring(2, 4));
    return erGyldigPnummer(dag, maaned)
        || erGyldigDNummer(dag, maaned)
        || erGyldigHNummer(dag, maaned);
}

function erGyldigPersonnummer(personnummer) {
    if (!erGyldigFodselsnummer(personnummer.substring(0, 6))) {
        return false;
    }
    var personnummerListe = personnummer.split('').map(function (x) {return parseInt(x)});
    var kontrollSiffer1 = kontrollSiffer(personnummerListe.slice(0, 9), kontrollRekke1);
    var kontrollSiffer2 = kontrollSiffer(personnummerListe.slice(0, 10), kontrollRekke2);
    return personnummerListe[9] === kontrollSiffer1 && personnummerListe[10] === kontrollSiffer2;
}

export const lagPersonnummerfeilmelding = (personnummer) => {
    if (!personnummer.match(/^\d+$/)) {
        return IKKE_BARE_TALL_FEILMELDING;
    } else if (personnummer.length > 11) {
        return FOR_MANGE_TEGN_FEILMELDING;
    } else if (personnummer.length < 11) {
        return FOR_FAA_TEGN_FEILMELDING;
    } else if (!erGyldigPersonnummer(personnummer)) {
        return IKKE_GYLDIG_KONTROLLSIFFER_FEILMELDING;
    }
    return null;
};

const personsok = () => {
    var sokefelt = document.getElementById("js-deokorator-sokefelt");
    var valideringslinje = document.getElementById("js-dekorator-feilmelding");
    var valideringslinjeTekst = document.getElementById("js-dekorator-feilmelding-tekst");
    var ERROR_CLASS = 'dekorator__sokefelt__valideringsfeil';
    var ERROR_BANNER_CLASS = 'dekorator__feilmelding__banner';

    function fjernSoketekst() {
        sokefelt.value = '';
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

    function validerInput (input) {
        var feilmelding  = lagPersonnummerfeilmelding(input);
        if (feilmelding) {
            markerSomFeil(feilmelding);
            return false;
        } else {
            markerSomGyldig();
            return true;
        }
    }


    if (sokefelt) {
        sokefelt.addEventListener("keyup", function (event) {
            var ENTER_KEY_CODE = 13;
            if (event.keyCode === ENTER_KEY_CODE) {
                var input = event.target.value.replace(/\s/g, '');
                if (validerInput(input)) {
                    triggerPersonsokEvent(input);
                    fjernSoketekst();
                }
            } else {
                markerSomGyldig(event.input);
            }
        });
    }
};

export default personsok;
