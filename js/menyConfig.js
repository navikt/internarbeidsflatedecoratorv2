import { finnMiljoStreng, finnNaisMiljoStreng, finnStillingMiljoStreng } from './sagas/util';

const modappDomain = `https://modapp${finnMiljoStreng()}.adeo.no`;
const wasappDomain = `https://wasapp${finnMiljoStreng()}.adeo.no`;
const appDomain = `https://app${finnMiljoStreng()}.adeo.no`;
const naisDomain = `.nais.${finnNaisMiljoStreng()}`;
const stillingsokUrl = `https://stillingsok${finnStillingMiljoStreng()}.nav.no `;

const arenaLink = () => `http://arena${finnMiljoStreng()}.adeo.no/forms/arenaMod${finnMiljoStreng().replace('-', '_')}.html`;

function getArenaConfigParameter(miljø) {
    if (miljø === '') {
        return 'arena';
    } else if (miljø === 'q0') {
        return 'areq0';
    }
    return `are${miljø.charAt(0)}${miljø.substring(1).padStart(2, '0')}`;
}

function getArenaStartsideLink() {
    const miljø = finnMiljoStreng().replace('-', '');
    return `http://arena${finnMiljoStreng()}.adeo.no/forms/frmservlet?config=${getArenaConfigParameter(miljø)}`;
}

export const funksjonsomradeLenker = (fnr, enhet) => [
    {
        tittel: 'Oppfølging',
        lenker: [
            {
                tittel: 'Arbeidsmarkedet',
                url: `${appDomain}/mia/ledigestillinger`,
            },
            {
                tittel: 'Enhetens oversikt',
                url: `${appDomain}/veilarbportefoljeflatefs/enhet?enhet=${enhet}&clean`,
            },
            {
                tittel: 'Min oversikt',
                url: `${appDomain}/veilarbportefoljeflatefs/portefolje?enhet=${enhet}&clean`,
            },
            {
                tittel: 'Aktivitetsplan',
                // Feil i eslint, fnr kan være undefined og da havner det i urlen, og det vil vi ikke
                // eslint-disable-next-line no-unneeded-ternary
                url: `${appDomain}/veilarbpersonflatefs/${fnr ? fnr : ''}`,
            },
            {
                tittel: 'Sykmeldt enkeltperson',
                // eslint-disable-next-line no-unneeded-ternary
                url: `${appDomain}/sykefravaer/${fnr ? fnr : ''}`,
            },
            {
                tittel: 'Sykefraværsoppgaver',
                url: `${appDomain}/sykefravaersoppfoelging/`,
            },
            {
                tittel: 'Dialogmøter',
                url: `${appDomain}/moteoversikt/`,
            },
            {
                tittel: 'Finn fastlege',
                url: `${appDomain}/fastlege/`,
            },
        ],
    },
    {
        tittel: 'Personoversikt',
        lenker: [
            {
                tittel: 'Oversikt',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}` : ''}`,
            },
            {
                tittel: 'Saksoversikt',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}#!saksoversikt` : ''}`,
            },
            {
                tittel: 'Meldinger',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}#!meldinger` : ''}`,
            },
            {
                tittel: 'Varslinger',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}#!varsling` : ''}`,
            },
            {
                tittel: 'Utbetalinger',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}#!utbetalinger` : ''}`,
            },
            {
                tittel: 'Oppfølging',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}#!kontrakter` : ''}`,
            },
            {
                tittel: 'Brukerprofil',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}#!brukerprofil` : ''}`,
            },
        ],
    },
];

function getGosysUrl(fnr) {
    if (fnr) {
        return `${wasappDomain}/gosys/personoversikt/fnr=${fnr}`;
    }
    return `${wasappDomain}/gosys/`;
}

export function gosysLenke(fnr) {
    const url = getGosysUrl(fnr);
    return {
        tittel: 'Gosys',
        url,
    };
}

function getPesysUrl(fnr) {
    if (fnr) {
        return `${wasappDomain}/psak/brukeroversikt/fnr=${fnr}`;
    }
    return `${wasappDomain}/psak/`;
}

export function pesysLenke(fnr) {
    const url = getPesysUrl(fnr);
    return {
        tittel: 'Pesys',
        url,
    };
}

export function arenaLenke(fnr) {
    let url = '';
    if (!fnr) {
        url = getArenaStartsideLink();
    } else {
        url = `${arenaLink()}?oppstart_skj=AS_REGPERSONALIA&fodselsnr=${fnr}`;
    }

    return {
        tittel: 'Arena personmappen',
        url,
    };
}

function aaRegister(fnr) {
    return {
        tittel: 'AA register',
        url: `${modappDomain}/aareg-web/?rolle=arbeidstaker&${fnr ? `ident=${fnr}` : ''}`,
    };
}

export function foreldrepengerLenke(aktorId) {
    if (!aktorId) {
        return {
            tittel: 'Foreldrepenger',
            url: `${appDomain}/fpsak`,
        };
    }
    return {
        tittel: 'Foreldrepenger',
        url: `${appDomain}/fpsak/${aktorId.data}`,
    };
}

export function rekrutteringsBistandLenke() {
    return {
        tittel: 'Rekrutteringsbistand',
        url: `https://rekrutteringsbistand${naisDomain}`,
    };
}

export function sokEtterStillingLenke() {
    return {
        tittel: 'Søk etter stilling',
        url: `${stillingsokUrl}`,
    };
}

export const andreSystemerLenker = (fnr, aktorId, enhet) => ({ // eslint-disable-line no-unused-vars
    tittel: 'Andre systemer',
    lenker: [
        arenaLenke(fnr),
        aaRegister(fnr),
        pesysLenke(fnr),
        gosysLenke(fnr),
        foreldrepengerLenke(null), // Frem til VL har laget landingsside: https://jira.adeo.no/browse/PFP-1762
        rekrutteringsBistandLenke(),
        sokEtterStillingLenke(),
    ],
});
