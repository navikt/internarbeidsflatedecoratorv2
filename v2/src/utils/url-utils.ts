declare global {
    interface Window {
        msCrypto: {};
    }
}

function matchTest(url: string, regex: RegExp, ifMatch: (match: RegExpExecArray) => string) {
    const res = regex.exec(url);
    if (res) {
        return ifMatch(res);
    }
}

export function hentMiljoFraUrl(): string {
    const url = window.location.host;

    const matched =
        matchTest(url, /localhost/, () => 'local') ||
        matchTest(url, /-([tq]\d+)\.nais\.preprod\.local/, (match) => match[1]) ||
        matchTest(url, /\.nais\.preprod\.local/, (match) => 'q0') ||
        matchTest(url, /\.nais\.adeo\.no/, () => 'p') ||
        matchTest(url, /-([tq]\d+)\.adeo\.no/, (match) => match[1]) ||
        matchTest(url, /\.adeo\.no/, () => 'p') ||
        'p'; // Hvis alt har feilet så antar vi produksjon, slik at ting fungerer der.

    if (matched === 'q') {
        return 'q0';
    }
    return matched;
}

export function erLocalhost() {
    return hentMiljoFraUrl() === 'local';
}

export function finnMiljoStreng() {
    const miljo = hentMiljoFraUrl();
    if (miljo === 'p') {
        return '';
    }
    return miljo === 'local' ? '-q0' : `-${miljo}`;
}

export function finnNaisMiljoStreng() {
    const miljo = hentMiljoFraUrl();
    if (miljo === 'p') {
        return 'nais.adeo.no/';
    }
    return 'nais.preprod.local/';
}

export function randomCallId() {
    let idx = 0;
    const c = window.crypto || window.msCrypto;
    const rnd = Array.from(c.getRandomValues(new Uint8Array(32))).map((value) =>
        (value & 15).toString(16)
    );
    return '00000000-0000-0000-0000-000000000000'.replace(/0/g, () => rnd[idx++]);
}
