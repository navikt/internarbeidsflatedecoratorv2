declare global {
    interface Window {
        msCrypto: {};
    }
}

interface UrlEnvironment {
    environment: string;
    envclass: string;
    isNaisUrl: boolean;
}

interface UrlRule {
    regExp: RegExp;
    ifMatch(match: RegExpExecArray): UrlEnvironment;
}

const urlRules: Array<UrlRule> = [
    {
        regExp: /localhost/,
        ifMatch: () => ({ environment: 'local', isNaisUrl: false, envclass: 'local' })
    },
    {
        regExp: /-([tq]\d+)\.nais\.preprod\.local/,
        ifMatch: (match) => ({
            environment: match[1],
            isNaisUrl: true,
            envclass: match[1].charAt(0)
        })
    },
    {
        regExp: /\.nais\.preprod\.local/,
        ifMatch: (match) => ({ environment: 'q0', isNaisUrl: true, envclass: 'q' })
    },
    {
        regExp: /\.nais\.adeo\.no/,
        ifMatch: (match) => ({ environment: 'p', isNaisUrl: true, envclass: 'p' })
    },
    {
        regExp: /-([tq]\d+)\.adeo\.no/,
        ifMatch: (match) => ({
            environment: match[1],
            isNaisUrl: false,
            envclass: match[1].charAt(0)
        })
    },
    {
        regExp: /\.adeo\.no/,
        ifMatch: () => ({ environment: 'p', isNaisUrl: false, envclass: 'p' })
    },
    {
        regExp: /.*/,
        ifMatch: () => ({ environment: 'p', isNaisUrl: false, envclass: 'p' })
    }
];

export function hentMiljoFraUrl(): UrlEnvironment {
    const url = window.location.host;

    const rule: UrlRule = urlRules.find(({ regExp }) => regExp.exec(url))!;
    return rule.ifMatch(rule.regExp.exec(url)!);
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

export function randomGuid() {
    let idx = 0;
    const c = window.crypto || window.msCrypto;
    const rnd = Array.from(c.getRandomValues(new Uint8Array(32))).map((value) =>
        (value & 15).toString(16)
    );
    return '00000000-0000-0000-0000-000000000000'.replace(/0/g, () => rnd[idx++]);
}
