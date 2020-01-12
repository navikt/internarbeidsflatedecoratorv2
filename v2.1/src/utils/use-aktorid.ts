import React from 'react';
import { MaybeCls } from '@nutgaard/maybe-ts';
import { finnMiljoStreng, randomCallId } from './url-utils';
import useFetch, { UseFetchHook } from '../hooks/use-fetch';
import { AktorIdResponse } from '../domain';
import { erGyldigFodselsnummer } from './fnr-utils';

export const defaultAktorIdUrl = `https://app${finnMiljoStreng()}.adeo.no/aktoerregister/api/v1/identer?identgruppe=AktoerId`;
export function useAktorId(
    aktoridUrl: string,
    maybeFnr: MaybeCls<string>
): UseFetchHook<AktorIdResponse> {
    const fnr = maybeFnr.withDefault('');
    const aktorIdRequest: RequestInit = React.useMemo<RequestInit>(
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

    return useFetch<AktorIdResponse>(aktoridUrl, aktorIdRequest, erGyldigFodselsnummer(fnr));
}
