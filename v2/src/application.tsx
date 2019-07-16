import React from 'react';
import {MaybeCls} from '@nutgaard/maybe-ts';
import Banner from './components/banner';
import Lenker from './components/lenker';
import {useWrappedState, WrappedState} from './hooks/use-wrapped-state';
import useFetch, {empty as emptyFetchState, UseFetchHook} from './hooks/use-fetch';
import {AktorIdResponse, Enheter, Me, Toggles} from './domain';
import {EMDASH} from './utils/string-utils';
import Feilmelding from "./components/feilmelding";
import {useAktorId} from "./utils/use-aktorid";

export interface Props {
    appname: string;
    fnr: string | undefined | null;
    enhet: string | undefined | null;
    disableWebsockets: boolean;
    toggles: Toggles,
    markup?: { etterSokefelt?: string }
    onSok(fnr: string): void;
    onEnhetChange(enhet: string): void;
}

interface Context {
    appname: string;
    fnr: MaybeCls<string>;
    enhet: MaybeCls<string>;
    disableWebsockets: boolean;
    toggles: Toggles;
    markupEttersokefelt: MaybeCls<string>;
    onSok(fnr: string): void;
    onEnhetChange(enhet: string): void;
    me: UseFetchHook<Me>;
    enheter: UseFetchHook<Enheter>;
    aktorId: UseFetchHook<AktorIdResponse>;
    feilmelding: WrappedState<MaybeCls<string>>;
    apen: WrappedState<boolean>;
}

export const AppContext = React.createContext<Context>({
    appname: EMDASH,
    fnr: MaybeCls.nothing(),
    enhet: MaybeCls.nothing(),
    disableWebsockets: true,
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
    apen: { value: false, set() {}}
});

function Application(props: Props) {
    const { fnr, enhet, markup, ...rest } = props;
    const apen = useWrappedState(false);
    const feilmelding = useWrappedState<MaybeCls<string>>(MaybeCls.nothing());
    const me = useFetch<Me>('/hode/me');
    const enheter = useFetch<Enheter>('/hode/enheter');
    const aktorId = useAktorId(MaybeCls.of(fnr));
    const markupEttersokefelt = MaybeCls.of(markup).flatMap((m) => MaybeCls.of(m.etterSokefelt));

    const context = { ...rest, me, enheter, aktorId, fnr: MaybeCls.of(fnr), enhet: MaybeCls.of(enhet), feilmelding, apen, markupEttersokefelt };
    return (
        <AppContext.Provider value={context}>
            <div className="dekorator">
                <Banner />
                <Lenker />
                <Feilmelding />
            </div>
        </AppContext.Provider>
    );
}

Application.defaultProps = {
    disableWebsockets: false
};

export default Application;
