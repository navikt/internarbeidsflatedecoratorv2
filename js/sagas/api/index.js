export function getWithHeaders(url, fnr) {
    return fetch(url, {
        credentials: 'include',
        headers: {
            'Nav-Consumer-Id': 'internarbeidsflatedecorator',
            'Nav-Call-Id': 'todo',
            'Nav-Identer': fnr,
        },
    })
        .then((res) => {
            if (res.status === 404) {
                throw new Error('404');
            } else if (res.status === 403) {
                throw new Error('403');
            }
            if (res.status > 400) {
                throw new Error('Det oppstod en feil');
            }
            return res.json();
        })
        .catch((err) => {
            throw err;
        });
}

export function get(url) {
    return getWithHeaders(url, undefined);
}

export function post(url, body) {
    return fetch(url, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => {
            if (res.status > 400) {
                throw new Error('Forespørsel feilet');
            } else {
                return res;
            }
        })
        .catch((err) => {
            throw err;
        });
}
