import {spawn} from "redux-saga/effects";

export function* spawnConditionally<Fn extends (...args: any[]) => any>(callback?: Fn, ...args: Parameters<Fn>) {
    if (callback) {
        yield spawn(callback, ...args);
    }
}
