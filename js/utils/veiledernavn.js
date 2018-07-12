const MAKS_ANTALL_TEGN_I_NAVN = 15;

const fornavn = (navn) => (navn.split(/\s+/)[0]);

const mellomnavn = (navn) => {
    const navneliste = navn.split(/\s+/);
    return navneliste.splice(1, navneliste.length - 2);
};

const etternavn = (navn) => {
    const navneliste = navn.split(/\s+/);
    return navneliste[navneliste.length - 1];
};

const tilInitial = (navn) => (`${navn.substring(0, 1)}.`);

const forkortMellomnavn = (navn) => (
    [fornavn(navn)].concat(mellomnavn(navn).map((x) => tilInitial(x))).concat(etternavn(navn)).join(' ')
);

const forkortEtternavn = (navn) => (
        `${fornavn(navn)} ${mellomnavn(navn).map((x) => tilInitial(x)).join(' ')} ${tilInitial(etternavn(navn))}`
);

const settCasing = (fulltNavn) => (
    fulltNavn.split(' ').map(navn =>
        navn.charAt(0) + navn.slice(1).toLowerCase()
    ).join(' ')
);

const visningsnavn = (fulltNavn, nameCase) => {
    const navn = (nameCase || nameCase === undefined) ? settCasing(fulltNavn) : fulltNavn;
    if (navn.length <= MAKS_ANTALL_TEGN_I_NAVN) {
        return navn;
    }
    const forkortetNavn = forkortMellomnavn(navn);
    if (forkortetNavn.length <= MAKS_ANTALL_TEGN_I_NAVN) {
        return forkortetNavn;
    }
    return forkortEtternavn(navn);
};

export default visningsnavn;
