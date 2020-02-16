import {select, spawn} from "redux-saga/effects";
import {InitializedState, isInitialized, State} from "./index";

export const RESET_VALUE = '\u0000';

export function* spawnConditionally<Fn extends (...args: any[]) => any>(callback?: Fn, ...args: Parameters<Fn>) {
    if (callback) {
        yield spawn(callback, ...args);
    }
}

export function* selectFromInitializedState<T, Fn extends (state: InitializedState) => T>(
    selector: Fn
) {
    const state = yield select((state: State) => state);
    if (isInitialized(state)) {
        return selector(state);
    }
    throw new Error('Could not get data from state since it is not initialized yet.');
}
