import { MaybeCls } from '@nutgaard/maybe-ts';
import {
    Data,
    EnhetContextvalueState,
    Feilmelding,
    FnrContextvalueState,
    Toggles
} from '../internal-domain';
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
    feilmeldinger: Array<Feilmelding>;
}

export interface UninitializedState {
    initialized: false;
    feilmeldinger: Array<Feilmelding>;
}

export type State = UninitializedState | InitializedState;

const initialState: State = {
    initialized: false,
    feilmeldinger: []
};

export function isInitialized(state: State): state is InitializedState {
    return state.initialized;
}

export function reducer(state: State = initialState, action: ReduxActions | SagaActions): State {
    if (action.type === ReduxActionTypes.FEILMELDING) {
        const feilmeldingFinnes =
            state.feilmeldinger.findIndex(
                (feilmelding) => feilmelding.message === action.data.message
            ) >= 0;
        if (feilmeldingFinnes) {
            return state;
        }

        return {
            ...state,
            feilmeldinger: state.feilmeldinger.concat(
                MaybeCls.of(action.data)
                    .filter((feilmelding) => feilmelding.message.length > 0)
                    .withDefault([])
            )
        };
    } else if (isInitialized(state)) {
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
