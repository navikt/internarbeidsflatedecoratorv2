import React, {useMemo} from 'react';
import {MaybeCls} from '@nutgaard/maybe-ts';
import Banner from './components/banner';
import Lenker from './components/lenker';
import {useWrappedState, WrappedState} from './hooks/use-wrapped-state';
import useFetch, {empty as emptyFetchState, UseFetchHook, usePromiseData} from './hooks/use-fetch';
import {AktivBruker, AktivEnhet, AktorIdResponse, Enheter, Markup, Me, Toggles} from './domain';
import {EMDASH} from './utils/string-utils';
import Feilmelding from "./components/feilmelding";
import {useAktorId} from "./utils/use-aktorid";
import NyEnhetContextModal from "./components/modals/ny-enhet-context-modal";
import {useContextholder} from "./hooks/use-contextholder";
import logging, {LogLevel} from './utils/logging';
import NyBrukerContextModal from "./components/modals/ny-bruker-context-modal";

logging.level = LogLevel.TRACE;

export interface BaseProps {
    appname: string;
    fnr: string | undefined | null;
    enhet: string | undefined | null;
    toggles: Toggles;
    markup?: Markup;
    identSource: () => Promise<Me>;
    enheterSource: () => Promise<Enheter>;

    onSok(fnr: string): void;

    onEnhetChange(enhet: string): void;
}

interface PropsWithWebsocket extends BaseProps {
    useContextholder: true;
    promptBeforeEnhetChange: boolean;
}

interface PropsWithoutWebsocket extends BaseProps {
    useContextholder: false;
}

type Props = PropsWithoutWebsocket | PropsWithWebsocket;

export interface Context {
    appname: string;
    fnr: MaybeCls<string>;
    enhet: MaybeCls<string>;
    toggles: Toggles;
    markupEttersokefelt: MaybeCls<string>;

    onSok(fnr: string): void;

    onEnhetChange(enhet: string): void;

    me: UseFetchHook<Me>;
    enheter: UseFetchHook<Enheter>;
    aktorId: UseFetchHook<AktorIdResponse>;
    feilmelding: WrappedState<MaybeCls<string>>;
    apen: WrappedState<boolean>;
    contextholder: false | {
        promptBeforeEnhetChange: boolean;
    }
}

export const AppContext = React.createContext<Context>({
    appname: EMDASH,
    fnr: MaybeCls.nothing(),
    enhet: MaybeCls.nothing(),
    toggles: {
        visEnhet: false,
        visEnhetVelger: false,
        visSokefelt: false,
        visVeilder: false
    },
    markupEttersokefelt: MaybeCls.nothing(),
    onSok() {
    },
    onEnhetChange() {
    },
    me: emptyFetchState,
    enheter: emptyFetchState,
    aktorId: emptyFetchState,
    feilmelding: {
        value: MaybeCls.nothing(), set() {
        }
    },
    apen: {
        value: false, set() {
        }
    },
    contextholder: false
});

function Application(props: Props) {
    const {fnr, enhet, markup, ...rest} = props;
    const maybeFnr = useMemo(() => MaybeCls.of(fnr).filter((fnr) => fnr.length > 0), [fnr]);
    const maybeEnhet = useMemo(() => MaybeCls.of(enhet).filter((fnr) => fnr.length > 0), [enhet]);
    const markupEttersokefelt = useMemo(() => MaybeCls.of(markup).flatMap((m) => MaybeCls.of(m.etterSokefelt)), [markup]);

    const apen = useWrappedState(false);
    const feilmelding = useWrappedState<MaybeCls<string>>(MaybeCls.nothing());
    const me = usePromiseData<Me>(props.identSource, true, []);
    const enheter = usePromiseData<Enheter>(props.enheterSource, true, []);
    const aktivEnhet = useFetch<AktivEnhet>('/modiacontextholder/api/context/aktivenhet');
    const aktivBruker = useFetch<AktivBruker>('/modiacontextholder/api/context/aktivbruker');
    const aktorId = useAktorId(maybeFnr);

    const promptBeforeEnhetChange = props.useContextholder && props.promptBeforeEnhetChange;
    const contextholder = useMemo(() => props.useContextholder ? { promptBeforeEnhetChange } : false as false, [props.useContextholder, promptBeforeEnhetChange]);
    const context = {
        ...rest,
        me,
        enheter,
        aktorId,
        fnr: maybeFnr,
        enhet: maybeEnhet,
        feilmelding,
        apen,
        markupEttersokefelt,
        contextholder
    };

    useContextholder(context, aktivEnhet, aktivBruker);
    return (
        <AppContext.Provider value={context}>
            <div className="dekorator">
                <Banner/>
                <Lenker/>
                <Feilmelding/>
                <NyEnhetContextModal
                    valgtEnhet={enhet}
                    contextEnhet={aktivEnhet}
                    onAccept={props.onEnhetChange}
                    onDecline={() => {}}
                />
                <NyBrukerContextModal
                    valgtFnr={fnr}
                    contextFnr={aktivBruker}
                    onAccept={props.onSok}
                    onDecline={() => {}}
                />
            </div>
        </AppContext.Provider>
    );
}

export default Application;
