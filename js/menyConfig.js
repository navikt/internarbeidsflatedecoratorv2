import { finnMiljoStreng, finnNaisMiljoStreng, NAIS_PREPROD_SUFFIX } from './sagas/util';
import { post } from './sagas/api';

const modappDomain = `https://modapp${finnMiljoStreng()}.adeo.no`;
const wasappDomain = `https://wasapp${finnMiljoStreng()}.adeo.no`;
const appDomain = `https://app${finnMiljoStreng()}.adeo.no`;
const tjenesterDomain = `https://tjenester${finnMiljoStreng()}.nav.no`;
const naisDomain = `.nais.${finnNaisMiljoStreng()}`;
const frontendLoggerApiEvent = '/frontendlogger/api/event';
const arbeidstreningDomain = `https://arbeidsgiver.nais.${finnNaisMiljoStreng()}`;
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

function byggArbeidssokerregistreringsURL(fnr, enhet) {
    return `https://arbeidssokerregistrering-fss${finnMiljoStreng()}${naisDomain}?${fnr ? `fnr=${fnr}` : ''}${fnr && enhet ? '&' : ''}${enhet ? `enhetId=${enhet}` : ''}`;
}

export const funksjonsomradeLenker = (fnr, enhet) => [
    {
        tittel: 'Oppfølging',
        lenker: [
            {
                tittel: 'Arbeidsmarkedet',
                url: `${tjenesterDomain}/mia/`,
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
            {
                tittel: 'Registrer arbeidssøker',
                // gå mot endepunkt i veilarblogin som setter cookie på nais-domene i preprod
                url: window.location.hostname.indexOf('-q') === -1 ?
                    byggArbeidssokerregistreringsURL(fnr, enhet) :
                    `https://veilarblogin${finnMiljoStreng()}${naisDomain}veilarblogin/api/start?url=${encodeURIComponent(byggArbeidssokerregistreringsURL(fnr, enhet))}`,
                onClick: () => post(`${frontendLoggerApiEvent}`, {
                    url: window.location.href,
                    userAgent: window.navigator.userAgent,
                    appName: 'internarbeidsflatedecorator',
                    name: 'internarbeidsflatedecorator.metrikker.registrering',
                    fields: {},
                    tags: {},
                }),
            },
            {
                tittel: 'Arbeidstrening',
                url: `${arbeidstreningDomain}tiltaksgjennomforing`,
                target: '_blank',
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

function getGosysNaisUrl() {
    const naisMiljo = finnNaisMiljoStreng();
    if (naisMiljo === NAIS_PREPROD_SUFFIX) {
        return 'https://gosys-nais-q1.nais.preprod.local';
    }
    return 'https://gosys-nais.nais.adeo.no';
}

function getGosysUrl(fnr) {
    const domain = getGosysNaisUrl();
    if (fnr) {
        return `${domain}/gosys/personoversikt/fnr=${fnr}`;
    }
    return `${domain}/gosys/`;
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
    return {
        tittel: 'Foreldrepenger',
        url: (aktorId && aktorId.data && aktorId.data.length > 0 ? `${appDomain}/fpsak/aktoer/${aktorId.data}` : `${appDomain}/fpsak/`),
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
        url: `https://rekrutteringsbistand${naisDomain}stillinger`,
    };
}

export const andreSystemerLenker = (fnr, aktorId, enhet) => ({ // eslint-disable-line no-unused-vars
    tittel: 'Andre systemer',
    lenker: [
        arenaLenke(fnr),
        aaRegister(fnr),
        pesysLenke(fnr),
        gosysLenke(fnr),
        foreldrepengerLenke(aktorId),
        rekrutteringsBistandLenke(),
        sokEtterStillingLenke(),
    ],
});
