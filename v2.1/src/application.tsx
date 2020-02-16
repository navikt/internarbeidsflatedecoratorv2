import React, { useCallback, useRef } from 'react';
import { Dispatch } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import store from './redux';
import { SagaActions, SagaActionTypes } from './redux/actions';
import { Contextholder, Contextvalue, Markup, Toggles, UrlOverrides } from './domain';
import Banner from './components/banner';
import Lenker from './components/lenker';
import NyEnhetContextModal from './components/modals/ny-enhet-context-modal';
import NyBrukerContextModal from './components/modals/ny-bruker-context-modal';
import Feilmelding from './components/feilmelding';
import { useWrappedState, WrappedState } from './hooks/use-wrapped-state';
import useOnClickOutside from './hooks/use-on-click-outside';
import { useOnMount } from './hooks/use-on-mount';

export interface Props {
    appname: string;
    fnr?: Contextvalue,
    enhet?: Contextvalue,
    toggles?: Toggles;
    markup?: Markup;
    contextholderConfig?: Contextholder;
    urler?: UrlOverrides
}

function Application(props: Props) {
    const dispatch = useDispatch<Dispatch<SagaActions>>();
    useOnMount(() => {
        dispatch({ type: SagaActionTypes.INIT, data: props });
    });

    const apen: WrappedState<boolean> = useWrappedState(false);

    const ref = useRef(null);
    const outsideHandler = useCallback(() => apen.set(false), [apen]);
    useOnClickOutside(ref, outsideHandler);

    return (
        <div className="dekorator" ref={ref}>
            <Banner apen={apen} />
            <Lenker apen={apen} />
            <Feilmelding />
            <NyEnhetContextModal />
            <NyBrukerContextModal />
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
                <Application {...this.props} />
            </Provider>
        );
    }
}

export default ErrorHandler;
