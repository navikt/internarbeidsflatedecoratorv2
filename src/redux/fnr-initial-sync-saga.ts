import { call, put } from 'redux-saga/effects';
import { MaybeCls } from '@nutgaard/maybe-ts';
import * as Api from './api';
import { FetchResponse, hasError } from './api';
import { AktivBruker } from '../internal-domain';
import { lagFnrFeilmelding } from '../utils/fnr-utils';
import {
    getContextvalueValue,
    RESET_VALUE,
    spawnConditionally,
    forkApiWithErrorhandling,
    callApiWithErrorhandling
} from './utils';
import { FnrContextvalue } from '../domain';
import { updateFnrValue } from './fnr-update-sagas';
import { leggTilFeilmelding } from './feilmeldinger/reducer';
import { PredefiniertFeilmeldinger } from './feilmeldinger/domain';

export default function* initialSyncFnr(props: FnrContextvalue) {
    if (getContextvalueValue(props) === RESET_VALUE) {
        yield callApiWithErrorhandling(
            PredefiniertFeilmeldinger.OPPDATER_BRUKER_CONTEXT_FEILET,
            Api.nullstillAktivBruker
        );
    }

    const response: FetchResponse<AktivBruker> = yield call(Api.hentAktivBruker);
    const onsketFnr = MaybeCls.of(getContextvalueValue(props))
        .map((fnr) => (fnr === RESET_VALUE ? '' : fnr))
        .map((fnr) => fnr.trim())
        .filter((fnr) => fnr.length > 0);
    const feilFnr = onsketFnr.flatMap(lagFnrFeilmelding);

    const contextholderFnr: MaybeCls<string> = MaybeCls.of(response.data)
        .flatMap((data) => MaybeCls.of(data.aktivBruker))
        .map((fnr) => fnr.trim())
        .filter((fnr) => fnr.length > 0);

    if (hasError(response)) {
        yield put(leggTilFeilmelding(PredefiniertFeilmeldinger.HENT_BRUKER_CONTEXT_FEILET));
    }

    if (feilFnr.isJust()) {
        const feilmelding = feilFnr.withDefault(PredefiniertFeilmeldinger.FNR_UKJENT_FEIL);
        yield put(leggTilFeilmelding(feilmelding));
    }

    if (onsketFnr.isJust() && feilFnr.isNothing()) {
        // Gyldig fnr via props, oppdaterer contextholder og kaller onSok med fnr
        const erUlikContextholderFnr =
            onsketFnr.withDefault('') !== contextholderFnr.withDefault('');
        if (erUlikContextholderFnr) {
            yield* forkApiWithErrorhandling(
                PredefiniertFeilmeldinger.OPPDATER_BRUKER_CONTEXT_FEILET,
                Api.oppdaterAktivBruker,
                onsketFnr.withDefault('')
            );
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
