import React from 'react';
import { MaybeCls } from '@nutgaard/maybe-ts';
import { randomCallId } from './url-utils';
import useFetch, { UseFetchHook } from '../hooks/use-fetch';
import { AktorIdResponse } from '../domain';
import { erGyldigFodselsnummer } from './fnr-utils';

export function useAktorId(maybeFnr: MaybeCls<string>): UseFetchHook<AktorIdResponse> {
    const fnr = maybeFnr.withDefault('');
    const aktorRequest: RequestInit = React.useMemo<RequestInit>(
        () => ({
            credentials: 'include',
            headers: {
                'Nav-Consumer-Id': 'internarbeidsflatedecorator',
                'Nav-Call-Id': randomCallId(),
                'Nav-Personidenter': fnr
            }
        }),
        [fnr]
    );

    return useFetch<AktorIdResponse>(
        '/aktoerregister/api/v1/identer?identgruppe=AktoerId',
        aktorRequest,
        erGyldigFodselsnummer(fnr)
    );
}
