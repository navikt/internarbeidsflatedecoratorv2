import React, { useEffect } from 'react';
import {
    finnMiljoStreng,
    finnNaisInternNavMiljoStreng,
    finnNaisMiljoStreng,
    hentMiljoFraUrl
} from '../utils/url-utils';
import { WrappedState } from "../hooks/use-wrapped-state";
import { useInitializedState } from "../hooks/use-initialized-state";
import { useEnhetContextvalueState, useFnrContextvalueState } from "../hooks/use-contextvalue-state";
import { Hotkey, ProxyConfig } from "../domain";
import { lagModiacontextholderUrl } from "../redux/api";
import { useDecoratorHotkeys } from "./hurtigtaster/hurtigtaster";
import './lenker.css';

function Lenke(props: { href: string; children: string; target?: string; }) {
    /* eslint-disable jsx-a11y/anchor-has-content */
    return (
        <li>
            <a {...props} className="typo-normal dekorator__menylenke" rel="noopener noreferrer" />
        </li>
    );
    /* eslint-enable jsx-a11y/anchor-has-content */
}

function getArenaConfigParameter(miljo: string) {
    if (miljo === '') {
        return 'arena';
    } else if (miljo === 'q0') {
        return 'areq0';
    }
    return `are${miljo.charAt(0)}${miljo.substring(1).padStart(2, '0')}`;
}

function getArenaStartsideLink() {
    const miljo = finnMiljoStreng().replace('-', '');
    return `http://arena${finnMiljoStreng()}.adeo.no/forms/frmservlet?config=${getArenaConfigParameter(miljo)}`;
}

const naisInternNavDomain = finnNaisInternNavMiljoStreng();
const gosysDomain = (path: string) => {
    const miljo = hentMiljoFraUrl();
    if (miljo.environment === 'p') {
        return `https://gosys.intern.nav.no${path}`;
    } else {
        return `https://gosys${finnMiljoStreng()}.intern.dev.nav.no${path}`;
    }
};
const pesysDomain = (path: string) => `https://pensjon-psak${finnNaisMiljoStreng(true)}${path}`;
const appDomain = (path: string) => `https://app${finnMiljoStreng()}.adeo.no${path}`;
const arenaLink = `http://arena${finnMiljoStreng()}.adeo.no/forms/arenaMod${finnMiljoStreng().replace('-', '_')}.html`;
const arenaUrl = (fnr: string) => fnr ? `${arenaLink}?oppstart_skj=AS_REGPERSONALIA&fodselsnr=${fnr}` : getArenaStartsideLink();
const modiaUrl = (fnr: string, path: string) => fnr ? appDomain(path) : appDomain('/modiapersonoversikt');
const pesysUrl = (fnr: string, path: string) => (fnr ? pesysDomain(path) : pesysDomain('/psak/'));
export const gosysUrl = (fnr: string, path: string) => fnr ? gosysDomain(path) : gosysDomain('/gosys/');
const fpsakUrl = `https://fpsak${finnNaisInternNavMiljoStreng()}`
const foreldrePengerUrl = (aktoerId: string) => aktoerId ? `${fpsakUrl}/aktoer/${aktoerId}` : `${fpsakUrl}/`;
const aktivitetsplanUrl = (fnr: string, enhet: string) => `https://veilarbpersonflate${finnNaisInternNavMiljoStreng()}/${fnr ? fnr : ''}?enhet=${enhet}`;

const inst2 = () => `https://inst2-web${finnNaisMiljoStreng(true)}/`;
function k9Url(aktorId: string): string {
    const miljo = hentMiljoFraUrl();
    const domain = miljo.environment === 'p' ? 'https://k9-los-web.nais.adeo.no/' : 'https://k9-los-web.dev.adeo.no/';
    if (aktorId) {
        return `${domain}aktoer/${aktorId}`
    } else {
        return domain
    }
}

function openUrl(url: string): () => void {
    return () => { window.open(url, '_blank'); };
}

function lagHotkeys(fnr: string, aktorId: string, enhet: string): Array<Hotkey> {
    return [
        {
            key: { char: 'G', altKey: true },
            action: openUrl(gosysUrl(fnr, `/gosys/personoversikt/fnr=${fnr}`)),
            description: 'Gå til gosys'
        },
        {
            key: { char: 'I', altKey: true },
            action: openUrl(pesysUrl(fnr, `/psak/brukeroversikt/fnr=${fnr}`)),
            description: 'Gå til pesys'
        },
        {
            key: { char: 'P', altKey: true },
            action: openUrl(arenaUrl(fnr)),
            description: 'Gå til arena'
        },
        {
            key: { char: 'K', altKey: true },
            action: openUrl(foreldrePengerUrl(aktorId)),
            description: 'Gå til fpsak'
        },
        {
            key: { char: 'A', altKey: true },
            action: openUrl(aktivitetsplanUrl(fnr, enhet)),
            description: 'Gå til aktivitetsplan'
        }
    ];
}

interface Props {
    apen: WrappedState<boolean>;
    proxyConfig: ProxyConfig;
}

function Lenker(props: Props) {
    const fnr = useFnrContextvalueState().withDefault('');
    const enhet = useEnhetContextvalueState().withDefault('');
    const aktorId: string = useInitializedState((state) => state.data.aktorId)
        .map((resp) => resp.aktorId)
        .withDefault('');

    const { register } = useDecoratorHotkeys();
    useEffect(() => {
        lagHotkeys(fnr, aktorId, enhet).forEach(register);
    }, [register, fnr, aktorId, enhet])

    if (!props.apen.value) {
        return null;
    }
    const modiacontextholderUrl = lagModiacontextholderUrl(props.proxyConfig);

    return (
        <div className="dekorator__nav dekorator__nav--apen">
            <div className="dekorator__container dekorator__meny">
                <div className="dekorator__kolonner">
                    <section className="dekorator__kolonne">
                        <h2 className="dekorator__lenkeheader">Personoversikt</h2>
                        <ul className="dekorator__menyliste">
                            <Lenke href={modiaUrl(fnr, `/modiapersonoversikt/person/${fnr}`)}>
                                Oversikt
                            </Lenke>
                            <Lenke href={modiaUrl(fnr, `/modiapersonoversikt/person/${fnr}/saker`)}>
                                Saksoversikt
                            </Lenke>
                            <Lenke href={modiaUrl(fnr, `/modiapersonoversikt/person/${fnr}/meldinger`)}>
                                Meldinger
                            </Lenke>
                            <Lenke href={modiaUrl(fnr, `/modiapersonoversikt/person/${fnr}/varsler`)}>
                                Varslinger
                            </Lenke>
                            <Lenke href={modiaUrl(fnr, `/modiapersonoversikt/person/${fnr}/utbetaling`)}>
                                Utbetalinger
                            </Lenke>
                            <Lenke href={modiaUrl(fnr, `/modiapersonoversikt/person/${fnr}/oppfolging`)}>
                                Oppfølging
                            </Lenke>
                            <Lenke href={modiaUrl(fnr, `/modiapersonoversikt/person/${fnr}/ytelser`)}>
                                Ytelser
                            </Lenke>
                        </ul>
                    </section>
                    <section className="dekorator__kolonne">
                        <h2 className="dekorator__lenkeheader">Arbeidsrettet oppfølging</h2>
                        <ul className="dekorator__menyliste">
                            <Lenke href={`https://veilarbportefoljeflate${finnNaisInternNavMiljoStreng()}/enhet?clean&enhet=${enhet}`}>
                                Enhetens oversikt
                            </Lenke>
                            <Lenke href={`https://veilarbportefoljeflate${finnNaisInternNavMiljoStreng()}/portefolje?clean&enhet=${enhet}`}>
                                Min oversikt
                            </Lenke>
                            <Lenke href={`https://beslutteroversikt${finnNaisInternNavMiljoStreng()}`}>
                                Kvalitetssikring 14a
                            </Lenke>
                            <Lenke href={aktivitetsplanUrl(fnr, enhet)}>
                                Aktivitetsplan
                            </Lenke>
                            <Lenke href={`https://arbeidssokerregistrering-for-veileder${finnNaisInternNavMiljoStreng()}/`}>
                                Registrer person
                            </Lenke>
                            <Lenke href={`https://tiltaksgjennomforing${finnNaisInternNavMiljoStreng()}/tiltaksgjennomforing`}>
                                Tiltaksgjennomføring - avtaler
                            </Lenke>
                            <Lenke href={`https://nav-arbeidsmarkedstiltak${naisInternNavDomain}/`} target="_blank">
                                Arbeidsmarkedstiltak
                            </Lenke>
                        </ul>
                    </section>
                    <section className="dekorator__kolonne">
                        <h2 className="dekorator__lenkeheader">Sykefraværsoppfølging</h2>
                        <ul className="dekorator__menyliste">
                            <Lenke href={`https://syfooversikt${finnNaisInternNavMiljoStreng()}/enhet`}>Enhetens oversikt</Lenke>
                            <Lenke href={`https://syfooversikt${finnNaisInternNavMiljoStreng()}/minoversikt`}>Min oversikt</Lenke>
                            <Lenke href={`https://syfomoteoversikt${finnNaisInternNavMiljoStreng()}/`}>Dialogmøteoversikt</Lenke>
                            <Lenke href={`https://finnfastlege${finnNaisInternNavMiljoStreng()}/fastlege/`}>Finn fastlege</Lenke>
                            <Lenke href={`https://syfomodiaperson${finnNaisInternNavMiljoStreng()}/sykefravaer`}>
                                Sykmeldt enkeltperson
                            </Lenke>
                        </ul>
                    </section>
                </div>
                <section className="dekorator__rad">
                    <h2 className="dekorator__lenkeheader">Andre systemer</h2>
                    <ul className="dekorator__menyliste">
                        <Lenke href={arenaUrl(fnr)} target="_blank">
                            Arena personmappen
                        </Lenke>
                        <Lenke href={`${modiacontextholderUrl}/redirect/aaregisteret`} target="_blank">
                            AA register
                        </Lenke>
                        <Lenke href={pesysUrl(fnr, `/psak/brukeroversikt/fnr=${fnr}`)} target="_blank">Pesys</Lenke>
                        <Lenke href={gosysUrl(fnr, `/gosys/personoversikt/fnr=${fnr}`)} target="_blank">
                            Gosys
                        </Lenke>
                        <Lenke href={foreldrePengerUrl(aktorId)} target="_blank">
                            Foreldrepenger
                        </Lenke>
                        <Lenke href={k9Url(aktorId)} target="_blank">
                            K9-sak
                        </Lenke>
                        <Lenke href={`https://rekrutteringsbistand${naisInternNavDomain}`} target="_blank">
                            Rekrutteringsbistand
                        </Lenke>
                        <Lenke href={inst2()} target="_blank">
                            INST2
                        </Lenke>
                        <Lenke href={`https://rekrutteringsbistand${naisInternNavDomain}/stillingssok?standardsok`} target="_blank">
                            Søk etter stilling
                        </Lenke>
                        <Lenke href={`https://sosialhjelp-modia${naisInternNavDomain}/sosialhjelp/modia/`} target="_blank">
                            Modia Sosialhjelp
                        </Lenke>
                        <Lenke href={`https://tiltak-refusjon${naisInternNavDomain}/`} target="_blank">
                            Refusjon tilskudd
                        </Lenke>
                        <Lenke href={`${modiacontextholderUrl}/redirect/salesforce`} target="_blank">
                            Salesforce
                        </Lenke>
                        <Lenke href={`https://data.intern.nav.no/quarto/e7b3e02a-0c45-4b5c-92a2-a6d364120dfb/`} target="_blank">
                            Kunnskapsbasen NKS
                        </Lenke>
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default Lenker;
