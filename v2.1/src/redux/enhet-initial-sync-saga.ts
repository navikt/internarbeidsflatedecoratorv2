import { call, put } from 'redux-saga/effects';
import { MaybeCls } from '@nutgaard/maybe-ts';
import * as Api from './api';
import { FetchResponse } from './api';
import { AktivEnhet, Data, Enhet } from '../internal-domain';
import {
    getContextvalueValue,
    RESET_VALUE,
    selectFromInitializedState,
    spawnConditionally,
    forkApiWithErrorhandling,
    callApiWithErrorhandling
} from './utils';
import { EnhetContextvalue } from '../domain';
import { updateEnhetValue } from './enhet-update-sagas';
import { leggTilFeilmelding } from './feilmeldinger/reducer';
import { PredefiniertFeilmeldinger } from './feilmeldinger/domain';

export default function* initialSyncEnhet(props: EnhetContextvalue) {
    if (getContextvalueValue(props) === RESET_VALUE) {
        yield* callApiWithErrorhandling(
            PredefiniertFeilmeldinger.OPPDATER_ENHET_CONTEXT,
            Api.nullstillAktivEnhet
        );
    }
    const response: FetchResponse<AktivEnhet> = yield call(Api.hentAktivEnhet);

    const state: Data = yield selectFromInitializedState((state) => state.data);
    const gyldigeEnheter: Array<string> = state.saksbehandler
        .map((data) => data.enheter)
        .withDefault<Array<Enhet>>([])
        .map((enhet) => enhet.enhetId);

    const onsketEnhet = MaybeCls.of(getContextvalueValue(props))
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
            yield* forkApiWithErrorhandling(
                PredefiniertFeilmeldinger.OPPDATER_ENHET_CONTEXT,
                Api.oppdaterAktivEnhet,
                onsketEnhet.withDefault('')
            );
        }

        yield* updateEnhetValue(onsketEnhet);
        yield spawnConditionally(props.onChange, onsketEnhet.withDefault(''));
    } else if (contextholderEnhet.isJust()) {
        yield* updateEnhetValue(contextholderEnhet);
        yield spawnConditionally(props.onChange, contextholderEnhet.withDefault(''));
    } else if (gyldigeEnheter.length > 0) {
        const fallbackEnhet = gyldigeEnheter[0];
        yield* forkApiWithErrorhandling(
            PredefiniertFeilmeldinger.OPPDATER_ENHET_CONTEXT,
            Api.oppdaterAktivEnhet,
            fallbackEnhet
        );
        yield* updateEnhetValue(MaybeCls.of(fallbackEnhet));
        yield spawnConditionally(props.onChange, fallbackEnhet);
    } else {
        yield* forkApiWithErrorhandling(
            PredefiniertFeilmeldinger.OPPDATER_ENHET_CONTEXT,
            Api.nullstillAktivBruker
        );
        yield put(leggTilFeilmelding(PredefiniertFeilmeldinger.INGEN_GYLDIG_ENHET));
    }
}
