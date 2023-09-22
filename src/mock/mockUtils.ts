import { MockedRequest, SetupWorker } from 'msw';
import { SetupServer } from 'msw/node';

export const spyMiddleware = () => {
    const requests = [] as MockedRequest[];
    return {
        requests,
        size: () => requests.length,
        called: (isMatching: (req: MockedRequest) => boolean) =>
            requests.some((req) => isMatching(req))
    };
};
export const setSpy = (worker: SetupServer | SetupWorker, spy: { requests: MockedRequest[] }) => {
    (worker as SetupWorker).events.on('request:start', (req) => {
        spy.requests.push(req);
    });
};

export const MatcherUtils = {
    del: (url: string) => (req: MockedRequest) => {
        return req.method === 'DELETE' && req.url.pathname === url;
    },
    get: (url: string) => (req: MockedRequest) => {
        return req.method === 'GET' && req.url.pathname === url;
    },
    post: (url: string) => (req: MockedRequest) => {
        return req.method === 'POST' && req.url.pathname === url;
    }
};
