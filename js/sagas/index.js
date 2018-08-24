import veilederSaga from './veilederSaga';
import enheterSaga from './enheterSaga';
import aktorSaga from './aktorSaga';

export default function * rootSaga() {
    yield [
        veilederSaga(),
        enheterSaga(),
        aktorSaga(),
    ];
}
