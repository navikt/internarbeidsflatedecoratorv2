const DEFAULT_FEILMELDING = 'Fødselsnummeret må inneholde 11 siffer';
const IKKE_BARE_TALL_FEILMELDING = 'Fødselsnummeret må kun inneholde tall';

export function erGyldigFodselsnummer(fodselsnummer) {
    return fodselsnummer.match(/^\d{11}$/);
}

export const lagFodselsnummerfeilmelding = (fodselsnummer) => {
    if (!fodselsnummer.match(/^\d+$/)) {
        return IKKE_BARE_TALL_FEILMELDING;
    }
    return DEFAULT_FEILMELDING;
};
