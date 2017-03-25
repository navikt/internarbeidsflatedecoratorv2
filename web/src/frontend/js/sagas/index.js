import veilederSaga from './veilederSaga';
import enheterSaga from './enheterSaga';

export default function * rootSaga() {
    yield [
        veilederSaga(),
        enheterSaga(),
    ];
}
