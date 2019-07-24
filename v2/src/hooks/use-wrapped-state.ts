import * as React from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

export interface WrappedState<T> {
    value: T;
    set(value: T): void;
}

export function emptyWrappedState<T>(value: T): WrappedState<T> {
    return { value, set() {} };
}

export type State<S> = [S, Dispatch<SetStateAction<S>>];
export function useWrappedState<T>(initialValue: T): WrappedState<T> {
    const [value, set] = React.useState<T>(initialValue);
    return React.useMemo(() => ({ value, set }), [value, set]);
}
