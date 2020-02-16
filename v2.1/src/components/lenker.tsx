import React, {useCallback} from 'react';
import {MaybeCls} from '@nutgaard/maybe-ts';
import {finnMiljoStreng, finnNaisMiljoStreng} from '../utils/url-utils';
import useHotkeys, {erAltOg, Hotkey, openUrl} from "../hooks/use-hotkeys";
import {WrappedState} from "../hooks/use-wrapped-state";
import {useSelector} from "react-redux";
import {State} from "../redux";

function Lenke(props: { href: string; children: string; target?: string; }) {
    /* eslint-disable jsx-a11y/anchor-has-content */
    const rel = props.target ? 'noopener noreferrer' : undefined;
    return (
        <li>
            <a {...props} className="typo-normal dekorator__menylenke" rel={rel} />
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

const naisDomain = finnNaisMiljoStreng();
const modappDomain = (path: string) => `https://modapp${finnMiljoStreng()}.adeo.no${path}`;
const wasappDomain = (path: string) => `https://wasapp${finnMiljoStreng()}.adeo.no${path}`;
const gosysDomain = (path: string) => `https://gosys-nais${finnNaisMiljoStreng(true)}${path}`;
const appDomain = (path: string) => `https://app${finnMiljoStreng()}.adeo.no${path}`;
const arenaLink = `http://arena${finnMiljoStreng()}.adeo.no/forms/arenaMod${finnMiljoStreng().replace('-', '_')}.html`;
const arenaUrl = (fnr: string) => fnr ? `${arenaLink}?oppstart_skj=AS_REGPERSONALIA&fodselsnr=${fnr}` : getArenaStartsideLink();
const modiaUrl = (fnr: string, path: string) => fnr ? modappDomain(path) : modappDomain('/modiabrukerdialog');
const pesysUrl = (fnr: string, path: string) => (fnr ? wasappDomain(path) : wasappDomain('/psak/'));
const gosysUrl = (fnr: string, path: string) => fnr ? gosysDomain(path) : gosysDomain('/gosys/');
const foreldrePengerUrl = (aktoerId: string, path: string) => aktoerId ? appDomain(path) : appDomain('/fpsak/');
const byggArbeidssokerregistreringsURL = (fnr: string, enhet: string) => `https://arbeidssokerregistrering-fss${finnMiljoStreng()}${naisDomain}?${fnr ? `fnr=${fnr}` : ''}${fnr && enhet ? '&' : ''}${enhet ? `enhetId=${enhet}` : ''}`;
const arbeidstreningDomain = `https://arbeidsgiver${finnNaisMiljoStreng()}`;


function lagHotkeys(fnr: string, aktorId: string): Array<Hotkey> {
    return [
        {
            matches: erAltOg('g'),
            execute: openUrl(gosysUrl(fnr, `/gosys/personoversikt/fnr=${fnr}`))
        },
        {
            matches: erAltOg('i'),
            execute: openUrl(pesysUrl(fnr, `/psak/brukeroversikt/fnr=${fnr}`))
        },
        {
            matches: erAltOg('p'),
            execute: openUrl(arenaUrl(fnr))
        },
        {
            matches: erAltOg('k'),
            execute: openUrl(foreldrePengerUrl(aktorId, `/fpsak/aktoer/${aktorId}`))
        }
    ];
}


function Lenker({apen}: { apen: WrappedState<boolean> }) {
    const fnr = useSelector((state: State) => state.fnr).withDefault('');
    const enhet = useSelector((state: State) => state.enhet).withDefault('');
    const aktorId = useSelector((state: State) => state.data.aktorId)
        .flatMap((resp) => MaybeCls.of(resp[fnr]))
        .flatMap((resp) => MaybeCls.of(resp.identer))
        .filter((identer) => identer.some((ident) => ident.gjeldende))
        .map((identer) => identer.find((ident) => ident.gjeldende)!)
        .map(({ident}) => ident)
        .withDefault('');

    const hotkeys = useCallback(lagHotkeys, [fnr, aktorId])(fnr, aktorId);
    useHotkeys(hotkeys);

    if (!apen.value) {
        return null;
    }

    return (
        <div className="dekorator__nav dekorator__nav--apen">
            <div className="dekorator__container dekorator__meny">
                <div className="dekorator__kolonner">
                    <section className="dekorator__kolonne">
                        <h2 className="dekorator__lenkeheader">Personoversikt</h2>
                        <ul className="dekorator__menyliste">
                            <Lenke href={modiaUrl(fnr, `/modiabrukerdialog/person/${fnr}`)}>
                                Oversikt
                            </Lenke>
                            <Lenke href={modiaUrl(fnr, `/modiabrukerdialog/person/${fnr}#!saksoversikt`)}>
                                Saksoversikt
                            </Lenke>
                            <Lenke href={modiaUrl(fnr, `/modiabrukerdialog/person/${fnr}#!meldinger`)}>
                                Meldinger
                            </Lenke>
                            <Lenke href={modiaUrl(fnr, `/modiabrukerdialog/person/${fnr}#!varsling`)}>
                                Varslinger
                            </Lenke>
                            <Lenke href={modiaUrl(fnr, `/modiabrukerdialog/person/${fnr}#!utbetalinger`)}>
                                Utbetalinger
                            </Lenke>
                            <Lenke href={modiaUrl(fnr, `/modiabrukerdialog/person/${fnr}#!kontrakter`)}>
                                Oppfølging
                            </Lenke>
                            <Lenke href={modiaUrl(fnr, `/modiabrukerdialog/person/${fnr}#!brukerprofil`)}>
                                Brukerprofil
                            </Lenke>
                        </ul>
                    </section>
                    <section className="dekorator__kolonne">
                        <h2 className="dekorator__lenkeheader">Arbeidsrettet oppfølging</h2>
                        <ul className="dekorator__menyliste">
                            <Lenke href={appDomain(`/veilarbportefoljeflatefs/enhet?clean&enhet=${enhet}`)}>
                                Enhetens oversikt
                            </Lenke>
                            <Lenke href={appDomain(`/veilarbportefoljeflatefs/portefolje?clean&enhet=${enhet}`)}>
                                Min oversikt
                            </Lenke>
                            <Lenke href={appDomain(`/veilarbpersonflatefs/${fnr ? fnr : ''}?enhet=${enhet}`)}>
                                Aktivitetsplan
                            </Lenke>
                            <Lenke href={byggArbeidssokerregistreringsURL(fnr, enhet)}>
                                Registrer arbeidssøker
                            </Lenke>
                            <Lenke href={`${arbeidstreningDomain}/tiltaksgjennomforing`}>
                                Arbeidstrening
                            </Lenke>
                        </ul>
                    </section>
                    <section className="dekorator__kolonne">
                        <h2 className="dekorator__lenkeheader">Sykefraværsoppfølging</h2>
                        <ul className="dekorator__menyliste">
                            <Lenke href={`https://syfooversikt${naisDomain}/enhet`}>Enhetens oversikt</Lenke>
                            <Lenke href={`https://syfooversikt${naisDomain}/minoversikt`}>Min oversikt</Lenke>
                            <Lenke href={`https://syfomoteoversikt${naisDomain}/`}>Dialogmøte</Lenke>
                            <Lenke href={`https://finnfastlege${naisDomain}/fastlege/`}>Finn fastlege</Lenke>
                            <Lenke href={appDomain(`/sykefravaer/${fnr ? fnr : ''}`)}>
                                Sykmeldt enkeltperson
                            </Lenke>
                        </ul>
                    </section>
                </div>
                <section className="dekorator__rad">
                    <h2 className="dekorator__lenkeheader">Andre systemer</h2>
                    <ul className="dekorator__menyliste">
                        <Lenke href={arenaUrl(fnr)}>
                            Arena personmappen
                        </Lenke>
                        <Lenke href={modappDomain(`/aareg-web/?rolle=arbeidstaker&${fnr ? `ident=${fnr}` : ''}`)}>
                            AA register
                        </Lenke>
                        <Lenke href={pesysUrl(fnr, `/psak/brukeroversikt/fnr=${fnr}`)}>Pesys</Lenke>
                        <Lenke href={gosysUrl(fnr, `/gosys/personoversikt/fnr=${fnr}`)}>
                            Gosys
                        </Lenke>
                        <Lenke href={foreldrePengerUrl(aktorId, `/fpsak/aktoer/${aktorId}`)}>
                            Foreldrepenger
                        </Lenke>
                        <Lenke href={`https://rekrutteringsbistand${naisDomain}`}>
                            Rekrutteringsbistand
                        </Lenke>
                        <Lenke href={`https://rekrutteringsbistand${naisDomain}/stillinger`}>
                            Søk etter stilling
                        </Lenke>
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default Lenker;
