import veilederSaga from './veilederSaga';
import enheterSaga from './enheterSaga';

export default function * rootSaga() {
    yield [
        veilederSaga(),
        enheterSaga(),
        //Frem til VL har laget landingsside: https://jira.adeo.no/browse/PFP-1762
        //aktorSaga(),
    ];
}
