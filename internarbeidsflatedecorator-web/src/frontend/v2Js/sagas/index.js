import saksbehandlerSaga from './saksbehandlerSaga';

export default function * rootSaga() {
    yield [
        saksbehandlerSaga(),
    ];
}
