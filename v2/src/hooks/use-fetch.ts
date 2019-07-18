import { MaybeCls as Maybe } from '@nutgaard/maybe-ts';
import {Reducer, ReducerState, useEffect, useReducer, useState, useMemo, DependencyList} from 'react';

type FetchActionInit = { type: 'FETCH_INIT' };
type FetchActionOk<TYPE> = { type: 'FETCH_OK', data: TYPE };
type FetchActionError = { type: 'FETCH_ERROR' };
type FetchActions<TYPE> = FetchActionInit | FetchActionError | FetchActionOk<TYPE>

type FetchData<TYPE> = {
    isLoading: boolean;
    isError: boolean;
    isOk: boolean;
    data: Maybe<TYPE>;
};
type FetchReducer<TYPE> = Reducer<FetchData<TYPE>, FetchActions<TYPE>>;
const initalState: FetchData<any> = {
    isLoading: true,
    isError: false,
    isOk: false,
    data: Maybe.nothing()
};

function fetchReducer<TYPE>(state: FetchData<TYPE>, action: FetchActions<TYPE>): FetchData<TYPE> {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, isLoading: true, isError: false };
        case 'FETCH_ERROR':
            return { ...state, isError: true, isLoading: false, isOk: false };
        case 'FETCH_OK':
            return { isError: false, isLoading: false, data: Maybe.just(action.data), isOk: true };
    }
}

export type UseFetchHook<TYPE> = ReducerState<FetchReducer<TYPE>> & {
    refetch(): void;
}

export const empty: UseFetchHook<any> = {
    isOk: false,
    isLoading: false,
    isError: false,
    data: Maybe.nothing(),
    refetch(): void {}
};

export default function useFetch<TYPE>(url: RequestInfo, option?: RequestInit, autorun: boolean = true, dependencyList?: DependencyList): UseFetchHook<TYPE> {
    const source = useMemo(() => async () => {
        const resp = await fetch(url, option);
        const json = await resp.json();
        return json as TYPE;
    }, [url, option]);

    return usePromiseData(source, autorun, dependencyList);
}

export function usePromiseData<TYPE>(source: () => Promise<TYPE>, autorun: boolean = true, dependencyList?: DependencyList): UseFetchHook<TYPE> {
    const [rerun, setRerun] = useState(0);
    const [state, dispatch] = useReducer<FetchReducer<TYPE>>(fetchReducer, initalState);
    useEffect(() => {
        let didCancel = false;

        async function fetchData() {
            dispatch({ type: 'FETCH_INIT' });
            try {
                const json = await source();
                if (!didCancel) {
                    dispatch({ type: 'FETCH_OK', data: json });
                }
            } catch (e) {
                if (!didCancel) {
                    dispatch({ type: 'FETCH_ERROR' });
                }
                throw e;
            }
        }

        if (autorun) {
            fetchData();
        }

        return () => {
            didCancel = true;
        };
        // Alle skal være med, men eslint greier ikke å analysere den
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencyList ? [...dependencyList, rerun, autorun] : [source, rerun, autorun]);


    const refetch = useMemo(() => () => setRerun(rerun + 1), [rerun]);

    return { ...state, refetch };
}
