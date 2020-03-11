import { call, fork, put } from 'redux-saga/effects';
import { MaybeCls } from '@nutgaard/maybe-ts';
import * as Api from './api';
import { FetchResponse } from './api';
import { AktivEnhet, Data, Enhet, FeilmeldingLevel } from '../internal-domain';
import { ReduxActionTypes } from './actions';
import { RESET_VALUE, selectFromInitializedState, spawnConditionally } from './utils';
import { EnhetContextvalue } from '../domain';
import { updateEnhetValue } from './enhet-update-sagas';

export default function* initialSyncEnhet(props: EnhetContextvalue) {
    if (props.initialValue === RESET_VALUE) {
        yield call(Api.nullstillAktivEnhet);
    }
    const response: FetchResponse<AktivEnhet> = yield call(Api.hentAktivEnhet);

    const state: Data = yield selectFromInitializedState((state) => state.data);
    const gyldigeEnheter: Array<string> = state.saksbehandler
        .map((data) => data.enheter)
        .withDefault<Array<Enhet>>([])
        .map((enhet) => enhet.enhetId);

    const onsketEnhet = MaybeCls.of(props.initialValue)
        .map((enhet) => (enhet === RESET_VALUE ? '' : enhet))
        .map((enhet) => enhet.trim())
        .filter((enhet) => enhet.length > 0)
        .filter((enhet) => gyldigeEnheter.includes(enhet));

    const contextholderEnhet: MaybeCls<string> = MaybeCls.of(response.data)
        .flatMap((data) => MaybeCls.of(data.aktivEnhet))
        .map((enhet) => enhet.trim())
        .filter((enhet) => enhet.length > 0)
        .filter((enhet) => gyldigeEnheter.includes(enhet));

    if (onsketEnhet.isJust()) {
        const erUlikContextholderEnhet =
            onsketEnhet.withDefault('') !== contextholderEnhet.withDefault('');
        if (erUlikContextholderEnhet) {
            yield fork(Api.oppdaterAktivEnhet, onsketEnhet.withDefault(''));
        }

        yield* updateEnhetValue(onsketEnhet);
        yield spawnConditionally(props.onChange, onsketEnhet.withDefault(''));
    } else if (contextholderEnhet.isJust()) {
        yield* updateEnhetValue(contextholderEnhet);
        yield spawnConditionally(props.onChange, contextholderEnhet.withDefault(''));
    } else if (gyldigeEnheter.length > 0) {
        const fallbackEnhet = gyldigeEnheter[0];
        yield fork(Api.oppdaterAktivEnhet, fallbackEnhet);
        yield* updateEnhetValue(MaybeCls.of(fallbackEnhet));
        yield spawnConditionally(props.onChange, fallbackEnhet);
    } else {
        yield fork(Api.nullstillAktivBruker);
        yield put({
            type: ReduxActionTypes.FEILMELDING,
            data: {
                level: FeilmeldingLevel.FATAL,
                message: 'Kunne ikke finne en passende enhet'
            }
        });
    }
}
