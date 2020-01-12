import { Action } from 'redux';
import { State } from './index';
import { AktorIdResponse, Saksbehandler } from '../domain';
import { Props } from '../application';

interface DataAction<TYPE, DATA> extends Action<TYPE> {
    data: DATA;
}

export enum ReduxActionTypes {
    UPDATESTATE = 'REDUX/UPDATESTATE',
    FEILMELDING = 'REDUX/FEILMELDING',
    AKTORIDDATA = 'REDUX/AKTORIDDATA',
    DEKORATORDATA = 'REDUX/DEKORATORDATA'
}

export enum SagaActionTypes {
    INIT = 'SAGA/INIT',
    ENHETCHANGED = 'SAGA/ENHETCHANGED',
    FNRCHANGED = 'SAGA/FNRCHANGED',
    FNRSUBMIT = 'SAGA/FNRSUBMIT',
    FNRRESET = 'SAGA/FNRRESET'
}

export type InitStore = DataAction<ReduxActionTypes.UPDATESTATE, Partial<State>>;
export type Feilmelding = DataAction<ReduxActionTypes.FEILMELDING, string>;
export type AktorIdData = DataAction<ReduxActionTypes.AKTORIDDATA, AktorIdResponse>;
export type DekoratorData = DataAction<ReduxActionTypes.DEKORATORDATA, Saksbehandler>;

export type SagaInit = DataAction<SagaActionTypes.INIT, Props>;
export type EnhetChanged = DataAction<SagaActionTypes.ENHETCHANGED, string>;
export type FnrChanged = DataAction<SagaActionTypes.FNRCHANGED, string>;
export type FnrSubmit = DataAction<SagaActionTypes.FNRSUBMIT, string>;
export type FnrReset = Action<SagaActionTypes.FNRRESET>;

export type ReduxActions = InitStore | Feilmelding | AktorIdData | DekoratorData;
export type SagaActions = SagaInit | EnhetChanged | FnrChanged | FnrSubmit | FnrReset;
