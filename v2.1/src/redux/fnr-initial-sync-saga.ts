import { call, fork, put } from 'redux-saga/effects';
import { MaybeCls } from '@nutgaard/maybe-ts';
import * as Api from './api';
import { FetchResponse, hasError } from './api';
import { AktivBruker } from '../internal-domain';
import { lagFnrFeilmelding } from '../utils/fnr-utils';
import { ReduxActionTypes } from './actions';
import { RESET_VALUE, spawnConditionally } from './utils';
import { FnrContextvalue } from '../domain';
import { updateFnrValue } from './fnr-update-sagas';

export default function* initialSyncFnr(props: FnrContextvalue) {
    if (props.initialValue === RESET_VALUE) {
        yield call(Api.nullstillAktivBruker);
        return;
    }

    const response: FetchResponse<AktivBruker> = yield call(Api.hentAktivBruker);
    const onsketFnr = MaybeCls.of(props.initialValue)
        .map((fnr) => (fnr === RESET_VALUE ? '' : fnr))
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
            data: 'Kunne ikke hente ut person i kontekst'
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
        const erUlikContextholderFnr =
            onsketFnr.withDefault('') !== contextholderFnr.withDefault('');
        if (erUlikContextholderFnr) {
            yield fork(Api.oppdaterAktivBruker, onsketFnr.withDefault(''));
        }
        yield* updateFnrValue(onsketFnr);
        yield spawnConditionally(props.onChange, onsketFnr.withDefault(''));
    } else if (onsketFnr.isNothing() && contextholderFnr.isJust()) {
        // Ikke noe fnr via props, bruker fnr fra contextholder og kaller onSok med dette
        yield* updateFnrValue(contextholderFnr);
        yield spawnConditionally(props.onChange, contextholderFnr.withDefault(''));
    } else {
        yield* updateFnrValue(onsketFnr);
    }
}
