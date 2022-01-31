import { runSaga, Saga } from 'redux-saga';

export async function run<S extends Saga>(saga: S, state: any, ...args: Parameters<S>) {
    const dispatched: Array<any> = [];
    await runSaga(
        {
            dispatch: (action) => dispatched.push(action),
            getState: () => state
        },
        saga,
        ...args
    ).toPromise();
    return dispatched;
}
