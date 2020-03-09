declare global {
    interface Window {
        msCrypto: {};
    }
}

function matchTest<T>(url: string, regex: RegExp, ifMatch: (match: RegExpExecArray) => T) {
    const res = regex.exec(url);
    if (res) {
        return ifMatch(res);
    }
}

export interface UrlEnvironment {
    environment: string;
    envclass: string;
    isNaisUrl: boolean;
}

export function hentMiljoFraUrl(): UrlEnvironment {
    const url = window.location.host;

    const matched: Omit<UrlEnvironment, 'envclass'> = matchTest(url, /localhost/, () => ({
        environment: 'local',
        isNaisUrl: false
    })) ||
        matchTest(url, /-([tq]\d+)\.nais\.preprod\.local/, (match) => ({
            environment: match[1],
            isNaisUrl: true
        })) ||
        matchTest(url, /\.nais\.preprod\.local/, () => ({ environment: 'q0', isNaisUrl: true })) ||
        matchTest(url, /\.nais\.adeo\.no/, () => ({ environment: 'p', isNaisUrl: true })) ||
        matchTest(url, /-([tq]\d+)\.adeo\.no/, (match) => ({
            environment: match[1],
            isNaisUrl: false
        })) ||
        matchTest(url, /\.adeo\.no/, () => ({ environment: 'p', isNaisUrl: false })) || {
            environment: 'p',
            isNaisUrl: false
        }; // Hvis alt har feilet så antar vi produksjon, slik at ting fungerer der.

    if (matched.environment === 'q') {
        matched.environment = 'q0';
    }

    const envclass =
        matchTest(matched.environment, /^local/, () => 'local') ||
        matchTest(matched.environment, /^t/, () => 't') ||
        matchTest(matched.environment, /^q/, () => 'q') ||
        matchTest(matched.environment, /^p/, () => 'p') ||
        'p';

    return {
        ...matched,
        envclass
    };
}

export function erLocalhost() {
    return hentMiljoFraUrl().environment === 'local';
}

export function finnMiljoStreng() {
    const miljo = hentMiljoFraUrl().environment;
    if (miljo === 'p') {
        return '';
    }
    return miljo === 'local' ? '-q0' : `-${miljo}`;
}

export function finnNaisMiljoStreng(envNamespace: boolean = false) {
    const miljo = hentMiljoFraUrl().environment;
    const prefix = envNamespace && miljo !== 'p' ? `-${miljo}` : '';
    if (miljo === 'p') {
        return `${prefix}.nais.adeo.no`;
    }
    return `${prefix}.nais.preprod.local`;
}

export function randomCallId() {
    let idx = 0;
    const c = window.crypto || window.msCrypto;
    const rnd = Array.from(c.getRandomValues(new Uint8Array(32))).map((value) =>
        (value & 15).toString(16)
    );
    return '00000000-0000-0000-0000-000000000000'.replace(/0/g, () => rnd[idx++]);
}
