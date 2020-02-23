import { MaybeCls } from '@nutgaard/maybe-ts';
import {
    Data,
    EnhetContextvalueState,
    FnrContextvalueState,
    Toggles,
    UninitializedState
} from '../internal-domain';
import { Contextholder, Markup } from '../domain';
import { ReduxActions, ReduxActionTypes, SagaActions } from './actions';

export interface InitializedState {
    initialized: true;
    appname: string;
    fnr: FnrContextvalueState;
    enhet: EnhetContextvalueState;
    toggles: Toggles;
    markup?: Markup;
    contextholderConfig: Contextholder;
    data: Data;
    feilmeldinger: Array<string>;
}

export type State = UninitializedState | InitializedState;

const initialState: State = {
    initialized: false
};

export function isInitialized(state: State): state is InitializedState {
    return state.initialized;
}

export function reducer(state: State = initialState, action: ReduxActions | SagaActions): State {
    if (isInitialized(state)) {
        if (action.type === ReduxActionTypes.INITIALIZE) {
            throw new Error(`Got '${action.type}' while store has already been initialized`);
        }

        switch (action.type) {
            case ReduxActionTypes.UPDATESTATE:
                return { ...state, ...action.data };
            case ReduxActionTypes.FEILMELDING:
                return {
                    ...state,
                    feilmeldinger: MaybeCls.of(action.data)
                        .filter((feilmelding) => feilmelding.length > 0)
                        .map((feilmelding) => [feilmelding])
                        .withDefault([])
                };
            case ReduxActionTypes.AKTORIDDATA:
                const aktorId = {
                    ...state.data,
                    aktorId: MaybeCls.of(action.data)
                };
                return {
                    ...state,
                    data: aktorId
                };
            default:
                return state;
        }
    } else {
        const ignorePatterns = ['@@redux/INIT', '@@INIT', 'SAGA/'];
        if (ignorePatterns.some((pattern) => action.type.startsWith(pattern))) {
            return state;
        }
        if (action.type !== ReduxActionTypes.INITIALIZE) {
            throw new Error(`Got '${action.type} while expecting ${ReduxActionTypes.INITIALIZE}'`);
        }
        return action.data;
    }
}
