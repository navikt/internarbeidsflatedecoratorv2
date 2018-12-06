function randomCallId() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export function getWithHeaders(url, fnr) {
    return fetch(url, {
        credentials: 'include',
        headers: {
            'Nav-Consumer-Id': 'internarbeidsflatedecorator',
            'Nav-Call-Id': randomCallId(),
            'Nav-Personidenter': fnr,
        },
    })
        .then((res) => {
            if (res.status !== 200) {
                throw new Error(`Det oppstod en feil, statuskode: ${res.status}`);
            }
            return res.json();
        })
        .catch((err) => {
            throw err;
        });
}

export function get(url) {
    return fetch(url, {
        credentials: 'include',
    })
        .then((res) => {
            if (res.status !== 200) {
                throw new Error(`Det oppstod en feil, statuskode: ${res.status}`);
            }
            return res.json();
        })
        .catch((err) => {
            throw err;
        });
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
