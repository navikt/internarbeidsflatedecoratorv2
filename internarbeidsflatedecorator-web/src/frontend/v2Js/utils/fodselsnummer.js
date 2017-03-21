const DEFAULT_FEILMELDING = 'Fødselsnummeret må inneholde 11 siffer';
const FOR_FAA_TEGN_FEILMELDING = DEFAULT_FEILMELDING;
const FOR_MANGE_TEGN_FEILMELDING = 'Fødselsnummeret må inneholde kun 11 siffer';
const IKKE_BARE_TALL_FEILMELDING = 'Fødselsnummeret må kun inneholde tall';
const IKKE_GYLDIG_KONTROLLSIFFER_FEILMELDING = 'Fødselsnummeret er ikke gyldig';

const kontrollRekke1 = [3, 7, 6, 1, 8, 9, 4, 5, 2];
const kontrollRekke2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

const decimalRadix = 10;

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

function erGyldigFodselsdato(fodselsnummer) {
    const dag = parseInt(fodselsnummer.substring(0, 2), decimalRadix);
    const maaned = parseInt(fodselsnummer.substring(2, 4), decimalRadix);
    return erGyldigPnummer(dag, maaned)
        || erGyldigDNummer(dag, maaned)
        || erGyldigHNummer(dag, maaned);
}

function hentKontrollSiffer(fodselsnummer, kontrollrekke) {
    let sum = 0;
    for (let sifferNummer = 0; sifferNummer < fodselsnummer.length; sifferNummer++) {
        sum += fodselsnummer[sifferNummer] * kontrollrekke[sifferNummer];
    }
    const kontrollSiffer = sum % 11;
    return kontrollSiffer !== 0 ? 11 - kontrollSiffer : 0;
}

export function erGyldigFodselsnummer(fodselsnummer) {
    if (!erGyldigFodselsdato(fodselsnummer.substring(0, 6))) {
        return false;
    }
    const fodselsnummerListe = fodselsnummer.split('').map(x => parseInt(x, decimalRadix));
    const kontrollSiffer1 = hentKontrollSiffer(fodselsnummerListe.slice(0, 9), kontrollRekke1);
    const kontrollSiffer2 = hentKontrollSiffer(fodselsnummerListe.slice(0, 10), kontrollRekke2);
    return fodselsnummerListe[9] === kontrollSiffer1 && fodselsnummerListe[10] === kontrollSiffer2;
}

export const lagFodselsnummerfeilmelding = (fodselsnummer) => {
    if (!fodselsnummer.match(/^\d+$/)) {
        return IKKE_BARE_TALL_FEILMELDING;
    } else if (fodselsnummer.length > 11) {
        return FOR_MANGE_TEGN_FEILMELDING;
    } else if (fodselsnummer.length < 11) {
        return FOR_FAA_TEGN_FEILMELDING;
    } else if (!erGyldigFodselsnummer(fodselsnummer)) {
        return IKKE_GYLDIG_KONTROLLSIFFER_FEILMELDING;
    }
    return null;
};
