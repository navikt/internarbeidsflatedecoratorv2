import React, { useCallback, useRef } from 'react';
import { MaybeCls } from '@nutgaard/maybe-ts';
import { Provider, useDispatch } from 'react-redux';
import Banner from './components/banner';
import Lenker from './components/lenker';
import { emptyWrappedState, useWrappedState, WrappedState } from './hooks/use-wrapped-state';
import { empty as emptyFetchState, UseFetchHook } from './hooks/use-fetch';
import { AktorIdResponse, Contextholder, Markup, Saksbehandler, Toggles } from './domain';
import { EMDASH } from './utils/string-utils';
import Feilmelding from './components/feilmelding';
import NyEnhetContextModal from './components/modals/ny-enhet-context-modal';
import logging, { LogLevel } from './utils/logging';
import NyBrukerContextModal from './components/modals/ny-bruker-context-modal';
import useOnClickOutside from './hooks/use-on-click-outside';
import store from './redux';
import { useOnMount } from './hooks/use-on-mount';
import { SagaActions, SagaActionTypes } from './redux/actions';
import { Dispatch } from 'redux';

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
    urler?: {
        aktoerregister?: string;
    };
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
    const { fnr, enhet } = props;
    const dispatch = useDispatch<Dispatch<SagaActions>>();
    useOnMount(() => {
        dispatch({ type: SagaActionTypes.INIT, data: props });
    });

    const enhetSynced = useWrappedState(false);
    const fnrSynced = useWrappedState(false);

    const apen: WrappedState<boolean> = useWrappedState(false);

    const ref = useRef(null);
    const outsideHandler = useCallback(() => apen.set(false), [apen]);
    useOnClickOutside(ref, outsideHandler);

    return (
        <div className="dekorator" ref={ref}>
            <Banner apen={apen} />
            <Lenker apen={apen} />
            <Feilmelding />
            <NyEnhetContextModal
                synced={enhetSynced.value}
                valgtEnhet={enhet}
                onAccept={props.onEnhetChange}
            />
            <NyBrukerContextModal synced={fnrSynced.value} valgtFnr={fnr} onAccept={props.onSok} />
        </div>
    );
}

class ErrorHandler extends React.Component<Props> {
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('CATCH', error, errorInfo);
    }

    render() {
        return (
            <Provider store={store}>
                <Application {...this.props} />;
            </Provider>
        );
    }
}

export default ErrorHandler;
