import React from 'react';
import {MaybeCls} from '@nutgaard/maybe-ts';
import Banner from './components/banner';
import Lenker from './components/lenker';
import {useWrappedState, WrappedState} from './hooks/use-wrapped-state';
import useFetch, {empty as emptyFetchState, UseFetchHook, usePromiseData} from './hooks/use-fetch';
import {AktorIdResponse, Enheter, Me, Toggles} from './domain';
import {EMDASH} from './utils/string-utils';
import Feilmelding from "./components/feilmelding";
import {useAktorId} from "./utils/use-aktorid";
import NyEnhetContextModal from "./components/modals/ny-enhet-context-modal";
import {useContextholder} from "./hooks/use-contextholder";

export interface BaseProps {
    appname: string;
    fnr: string | undefined | null;
    enhet: string | undefined | null;
    toggles: Toggles;
    markup?: { etterSokefelt?: string };
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

interface Context {
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
    onSok(){},
    onEnhetChange(){},
    me: emptyFetchState,
    enheter: emptyFetchState,
    aktorId: emptyFetchState,
    feilmelding: { value: MaybeCls.nothing(), set() {}},
    apen: { value: false, set() {}},
    contextholder: false
});

function Application(props: Props) {
    const { fnr, enhet, markup, ...rest } = props;
    const apen = useWrappedState(false);
    const feilmelding = useWrappedState<MaybeCls<string>>(MaybeCls.nothing());
    const me = usePromiseData<Me>(props.identSource);
    const enheter = usePromiseData<Enheter>(props.enheterSource);
    const contextEnhet = useFetch<{aktivEnhet: string}>('/modiacontextholder/api/context/aktivenhet');
    const contextBruker = useFetch<{aktivBruker: string}>('/modiacontextholder/api/context/aktivbruker');
    const aktorId = useAktorId(MaybeCls.of(fnr));
    useContextholder(contextEnhet, contextBruker, feilmelding);


    const markupEttersokefelt = MaybeCls.of(markup).flatMap((m) => MaybeCls.of(m.etterSokefelt));
    const contextholder = props.useContextholder ? { promptBeforeEnhetChange: props.promptBeforeEnhetChange } : false as false;
    const context = { ...rest, me, enheter, aktorId, fnr: MaybeCls.of(fnr), enhet: MaybeCls.of(enhet), feilmelding, apen, markupEttersokefelt, contextholder };
    return (
        <AppContext.Provider value={context}>
            <div className="dekorator">
                <Banner />
                <Lenker />
                <Feilmelding />
                <NyEnhetContextModal
                    valgtEnhet={enhet}
                    contextEnhet={contextEnhet}
                    onAccept={props.onEnhetChange}
                    onDecline={() => {}}
                />
            </div>
        </AppContext.Provider>
    );
}

export default Application;
