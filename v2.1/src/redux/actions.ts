import { Action } from 'redux';
import { InitializedState, State } from './reducer';
import { AktorIdResponse } from '../internal-domain';
import { ApplicationProps } from '../domain';
import { DataAction } from './utils';

export enum ReduxActionTypes {
    INITIALIZE = 'REDUX/INITSTATE',
    UPDATESTATE = 'REDUX/UPDATESTATE',
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
export type AktorIdData = DataAction<ReduxActionTypes.AKTORIDDATA, AktorIdResponse>;

export type SagaInit = DataAction<SagaActionTypes.INIT, ApplicationProps>;
export type EnhetChanged = DataAction<SagaActionTypes.ENHETCHANGED, string>;
export type FnrChanged = DataAction<SagaActionTypes.FNRCHANGED, string>;
export type FnrSubmit = DataAction<SagaActionTypes.FNRSUBMIT, string>;
export type FnrReset = Action<SagaActionTypes.FNRRESET>;

export type ReduxActions = InitStore | UpdateStore | AktorIdData;
export type SagaActions = SagaInit | EnhetChanged | FnrChanged | FnrSubmit | FnrReset;
