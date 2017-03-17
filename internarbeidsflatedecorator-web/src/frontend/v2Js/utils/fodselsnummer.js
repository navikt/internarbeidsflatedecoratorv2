var DEFAULT_FEILMELDING = 'Personnummeret må inneholde 11 siffer';
var FOR_FAA_TEGN_FEILMELDING = DEFAULT_FEILMELDING;
var FOR_MANGE_TEGN_FEILMELDING = 'Personnummeret må inneholde kun 11 siffer';
var IKKE_BARE_TALL_FEILMELDING = 'Personnummeret må kun inneholde tall';
var IKKE_GYLDIG_KONTROLLSIFFER_FEILMELDING = 'Personnummeret er ikke gyldig';

const kontrollRekke1 = [3, 7, 6, 1, 8, 9, 4, 5, 2];
const kontrollRekke2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

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

function kontrollSiffer(personnummer, kontrollrekke) {
    var sum = 0;
    for (var sifferNummer = 0; sifferNummer < personnummer.length; sifferNummer++) {
        sum += personnummer[sifferNummer] * kontrollrekke[sifferNummer];
    }
    var kontrollSiffer = sum % 11;
    return kontrollSiffer !== 0 ? 11 - kontrollSiffer : 0;
}

export function erGyldigPersonnummer(personnummer) {
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