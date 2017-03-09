import saksbehandlerSaga from './saksbehandlerSaga';
import enheterSaga from './enheterSaga';

export default function * rootSaga() {
    yield [
        saksbehandlerSaga(),
        enheterSaga(),
    ];
}
