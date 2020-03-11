import { Action } from 'redux';
import { InitializedState, State } from './reducer';
import { AktorIdResponse, Feilmelding as FeilmeldingType } from '../internal-domain';
import { ApplicationProps } from '../domain';

interface DataAction<TYPE, DATA> extends Action<TYPE> {
    data: DATA;
}

export enum ReduxActionTypes {
    INITIALIZE = 'REDUX/INITSTATE',
    UPDATESTATE = 'REDUX/UPDATESTATE',
    FEILMELDING = 'REDUX/FEILMELDING',
    AKTORIDDATA = 'REDUX/AKTORIDDATA'
}

export enum SagaActionTypes {
    INIT = 'SAGA/INIT',
    ENHETCHANGED = 'SAGA/ENHETCHANGED',
    FNRCHANGED = 'SAGA/FNRCHANGED',
    FNRSUBMIT = 'SAGA/FNRSUBMIT',
    FNRRESET = 'SAGA/FNRRESET',
    WS_ENHET_DECLINE = 'SAGA/WS_ENHET_DECLINE',
    WS_ENHET_ACCEPT = 'SAGA/WS_ENHET_ACCEPT',
    WS_FNR_DECLINE = 'SAGA/WS_FNR_DECLINE',
    WS_FNR_ACCEPT = 'SAGA/WS_FNR_ACCEPT'
}

export type InitStore = DataAction<ReduxActionTypes.INITIALIZE, InitializedState>;
export type UpdateStore = DataAction<ReduxActionTypes.UPDATESTATE, Partial<State>>;
export type Feilmelding = DataAction<ReduxActionTypes.FEILMELDING, FeilmeldingType>;
export type AktorIdData = DataAction<ReduxActionTypes.AKTORIDDATA, AktorIdResponse>;

export type SagaInit = DataAction<SagaActionTypes.INIT, ApplicationProps>;
export type EnhetChanged = DataAction<SagaActionTypes.ENHETCHANGED, string>;
export type FnrChanged = DataAction<SagaActionTypes.FNRCHANGED, string>;
export type FnrSubmit = DataAction<SagaActionTypes.FNRSUBMIT, string>;
export type FnrReset = Action<SagaActionTypes.FNRRESET>;

export type ReduxActions = InitStore | UpdateStore | Feilmelding | AktorIdData;
export type SagaActions = SagaInit | EnhetChanged | FnrChanged | FnrSubmit | FnrReset;
