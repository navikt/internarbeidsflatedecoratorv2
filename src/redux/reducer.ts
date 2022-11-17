import { MaybeCls } from '@nutgaard/maybe-ts';
import { Data, EnhetContextvalueState, FnrContextvalueState, Toggles } from '../internal-domain';
import { Markup } from '../domain';
import { ReduxActions, ReduxActionTypes, SagaActions } from './actions';

export interface InitializedState {
    initialized: true;
    appname: string;
    fnr: FnrContextvalueState;
    enhet: EnhetContextvalueState;
    toggles: Toggles;
    markup?: Markup;
    data: Data;
}

export interface UninitializedState {
    initialized: false;
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
        const ignorePatterns = ['@@redux/', '@@INIT', 'SAGA/', 'REDUX/FEILMELDING/'];
        if (ignorePatterns.some((pattern) => action.type.startsWith(pattern))) {
            return state;
        }
        if (action.type !== ReduxActionTypes.INITIALIZE) {
            throw new Error(`Got '${action.type} while expecting ${ReduxActionTypes.INITIALIZE}'`);
        }
        return action.data;
    }
}
