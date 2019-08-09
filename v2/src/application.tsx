import React, {useCallback, useMemo, useRef} from 'react';
import { MaybeCls } from '@nutgaard/maybe-ts';
import Banner from './components/banner';
import Lenker from './components/lenker';
import { emptyWrappedState, useWrappedState, WrappedState } from './hooks/use-wrapped-state';
import useFetch, { empty as emptyFetchState, UseFetchHook } from './hooks/use-fetch';
import {AktorIdResponse, Contextholder, Saksbehandler, Markup, Toggles} from './domain';
import { EMDASH } from './utils/string-utils';
import Feilmelding from './components/feilmelding';
import { useAktorId } from './utils/use-aktorid';
import NyEnhetContextModal from './components/modals/ny-enhet-context-modal';
import { useContextholder } from './hooks/use-contextholder';
import logging, { LogLevel } from './utils/logging';
import NyBrukerContextModal from './components/modals/ny-bruker-context-modal';
import {getWebSocketUrl, SAKSBEHANDLER_URL} from "./context-api";
import useOnClickOutside from "./hooks/use-on-click-outside";

logging.level = LogLevel.INFO;

export interface Props {
    appname: string;
    fnr: string | undefined | null;
    enhet: string | undefined | null;
    toggles: Toggles;
    markup?: Markup;

    onSok(fnr: string): void;

    onEnhetChange(enhet: string): void;
    contextholder?: true | Contextholder;
}

export interface Context {
    appname: string;
    fnr: MaybeCls<string>;
    enhet: MaybeCls<string>;
    toggles: Toggles;
    markupEttersokefelt: MaybeCls<string>;

    onSok(fnr: string): void;

    onEnhetChange(enhet: string): void;

    saksbehandler: UseFetchHook<Saksbehandler>;
    aktorId: UseFetchHook<AktorIdResponse>;
    feilmelding: WrappedState<MaybeCls<string>>;
    apen: WrappedState<boolean>;
    contextholder: MaybeCls<Contextholder>;
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
    onSok() {},
    onEnhetChange() {},
    saksbehandler: emptyFetchState,
    aktorId: emptyFetchState,
    feilmelding: emptyWrappedState(MaybeCls.nothing()),
    apen: emptyWrappedState(false),
    contextholder: MaybeCls.nothing()
});

function Application(props: Props) {
    const { fnr, enhet, markup, ...rest } = props;

    const maybeFnr = useMemo(() => MaybeCls.of(fnr).filter((fnr) => fnr.length > 0), [fnr]);
    const maybeEnhet = useMemo(() => MaybeCls.of(enhet).filter((fnr) => fnr.length > 0), [enhet]);
    const markupEttersokefelt = useMemo(
        () => MaybeCls.of(markup).flatMap((m) => MaybeCls.of(m.etterSokefelt)),
        [markup]
    );

    const enhetSynced = useWrappedState(false);
    const fnrSynced = useWrappedState(false);

    const apen = useWrappedState(false);
    const feilmelding = useWrappedState<MaybeCls<string>>(MaybeCls.nothing());
    const saksbehandler = useFetch<Saksbehandler>(SAKSBEHANDLER_URL, { credentials: 'include'}, true, []);
    const aktorId = useAktorId(maybeFnr);

    const contextholder = useMemo(() => {
        return MaybeCls.of(props.contextholder)
            .map((config) => ({ url: getWebSocketUrl(saksbehandler), ...(config === true ? {} : config) }));
    }, [props.contextholder, saksbehandler]);

    const context = {
        ...rest,
        saksbehandler,
        aktorId,
        fnr: maybeFnr,
        enhet: maybeEnhet,
        feilmelding,
        apen,
        markupEttersokefelt,
        contextholder
    };

    const ref = useRef(null);
    const outsideHandler = useCallback(() => apen.set(false), [apen]);
    useOnClickOutside(ref, outsideHandler);
    useContextholder(context, enhetSynced, fnrSynced);

    return (
        <AppContext.Provider value={context}>
            <div className="dekorator" ref={ref}>
                <Banner />
                <Lenker />
                <Feilmelding />
                <NyEnhetContextModal
                    synced={enhetSynced.value}
                    valgtEnhet={enhet}
                    onAccept={props.onEnhetChange}
                />
                <NyBrukerContextModal
                    synced={fnrSynced.value}
                    valgtFnr={fnr}
                    onAccept={props.onSok}
                />
            </div>
        </AppContext.Provider>
    );
}

class ErrorHandler extends React.Component<Props> {
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('CATCH', error, errorInfo);
    }

    render() {
        return <Application {...this.props} />;
    }
}

export default ErrorHandler;
