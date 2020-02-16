import {call, fork, put, select} from "redux-saga/effects";
import {MaybeCls} from "@nutgaard/maybe-ts";
import * as Api from './api';
import {FetchResponse, hasError} from './api';
import {AktivBruker, AktorIdResponse, Contextvalue} from "../domain";
import {lagFnrFeilmelding} from "../utils/fnr-utils";
import {ReduxActionTypes} from "./actions";
import {State} from "./index";
import {defaultAktorIdUrl} from "../utils/use-aktorid";
import {RESET_VALUE, spawnConditionally} from "./utils";

function* initAktorId() {
    const state: State = yield select();
    const aktorIdUrl = MaybeCls.of(state.urler)
        .flatMap((urler) => MaybeCls.of(urler.aktoerregister))
        .getOrElse(defaultAktorIdUrl);

    if (state.fnr.isJust()) {
        const fnr = state.fnr.withDefaultLazy(() => {
            throw new Error(`'state.fnr' was NOTHING while expecting JUST`);
        });

        const response: FetchResponse<AktorIdResponse> = yield call(
            Api.hentAktorId,
            aktorIdUrl,
            fnr
        );
        if (hasError(response)) {
            yield put({
                type: ReduxActionTypes.FEILMELDING,
                data: response.error,
                scope: 'initAktorId'
            });
        } else {
            yield put({type: ReduxActionTypes.AKTORIDDATA, data: response.data});
        }
    }
}

export type InitialSyncFnrState = Pick<State, 'fnr'>;
export default function* initialSyncFnr(props: Contextvalue) {
    if (props.initialValue === RESET_VALUE) {
        yield call(Api.nullstillAktivBruker);
        return;
    }

    const response: FetchResponse<AktivBruker> = yield call(Api.hentAktivBruker);
    const onsketFnr = MaybeCls.of(props.initialValue)
        .map((fnr) => fnr.trim())
        .filter((fnr) => fnr.length > 0);
    const feilFnr = onsketFnr.flatMap(lagFnrFeilmelding);

    const contextholderFnr: MaybeCls<string> = MaybeCls.of(response.data)
        .flatMap((data) => MaybeCls.of(data.aktivBruker))
        .map((fnr) => fnr.trim())
        .filter((fnr) => fnr.length > 0);

    if (hasError(response)) {
        yield put({
            type: ReduxActionTypes.FEILMELDING,
            data: 'Kunne ikke hente ut person i kontekst',
            scope: 'initSyncFnr - hasError'
        });
    }

    if (feilFnr.isJust()) {
        yield put({
            type: ReduxActionTypes.FEILMELDING,
            data: feilFnr.withDefault('Ukjent feil ved validering av fødselsnummer.'),
            scope: 'initSyncFnr - ugyldig fnr'
        });
    }

    if (onsketFnr.isJust() && feilFnr.isNothing()) {
        // Gyldig fnr via props, oppdaterer contextholder og kaller onSok med fnr
        const erUlikContextholderFnr = onsketFnr.withDefault('') !== contextholderFnr.withDefault('');
        if (erUlikContextholderFnr) {
            yield fork(Api.oppdaterAktivBruker, onsketFnr.withDefault(''));
        }

        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                fnr: onsketFnr
            },
            scope: 'initSyncFnr - by props'
        });
        yield spawnConditionally(props.onChange, onsketFnr.withDefault(''));
    } else if (onsketFnr.isNothing() && contextholderFnr.isJust()) {
        // Ikke noe fnr via props, bruker fnr fra contextholder og kaller onSok med dette
        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                fnr: contextholderFnr
            },
            scope: 'initSyncFnr - by contextholder'
        });
        yield spawnConditionally(props.onChange, contextholderFnr.withDefault(''));
    } else {
        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                fnr: onsketFnr
            },
            scope: 'initSyncFnr - by fallback'
        });
    }

    if (feilFnr.isNothing()) {
        yield fork(initAktorId);
    }
}
