declare global {
    interface Window {
        msCrypto: {};
    }
}

export enum UrlFormat {
    LOCAL, // localhost, github pages etc
    ADEO, // app.adeo.no / modapp.adeo.no
    NAIS, // nais.preprod.local / nais.adeo.no
    DEV_ADEO, // dev.adeo.no
    NAV_NO // dev.intern.nav.no / intern.av.no / intern.dev.nav.no
}

interface UrlEnvironment {
    environment: string;
    envclass: string;
    urlformat: UrlFormat;
}

interface UrlRule {
    regExp: RegExp;

    ifMatch(match: RegExpExecArray): UrlEnvironment;
}

const urlRules: Array<UrlRule> = [
    {
        regExp: /localhost/,
        ifMatch: () => ({ environment: 'local', envclass: 'local', urlformat: UrlFormat.LOCAL })
    },
    {
        regExp: /navikt\.github\.io/,
        ifMatch: () => ({ environment: 'local', envclass: 'local', urlformat: UrlFormat.LOCAL })
    },
    {
        regExp: /\.herokuapp\.com/,
        ifMatch: () => ({ environment: 'local', envclass: 'local', urlformat: UrlFormat.LOCAL })
    },
    {
        regExp: /\.labs\.nais\.io/,
        ifMatch: () => ({ environment: 'local', envclass: 'local', urlformat: UrlFormat.LOCAL })
    },
    {
        regExp: /-([tq]\d+)\.nais\.preprod\.local/,
        ifMatch: (match) => ({
            environment: match[1],
            envclass: match[1].charAt(0),
            urlformat: UrlFormat.NAIS
        })
    },
    {
        regExp: /\.nais\.preprod\.local/,
        ifMatch: (match) => ({ environment: 'q1', envclass: 'q', urlformat: UrlFormat.NAIS })
    },
    {
        regExp: /-([tq]\d+)\.dev\.adeo\.no/,
        ifMatch: (match) => ({
            environment: match[1],
            envclass: 'dev',
            urlformat: UrlFormat.DEV_ADEO
        })
    },
    {
        regExp: /\.dev\.adeo\.no/,
        ifMatch: (match) => ({ environment: 'q1', envclass: 'dev', urlformat: UrlFormat.DEV_ADEO })
    },
    {
        regExp: /\.nais\.adeo\.no/,
        ifMatch: (match) => ({ environment: 'p', envclass: 'p', urlformat: UrlFormat.NAIS })
    },
    {
        regExp: /-([tq]\d+)\.adeo\.no/,
        ifMatch: (match) => ({
            environment: match[1],
            envclass: match[1].charAt(0),
            urlformat: UrlFormat.ADEO
        })
    },
    {
        regExp: /\.adeo\.no/,
        ifMatch: () => ({ environment: 'p', envclass: 'p', urlformat: UrlFormat.ADEO })
    },
    {
        regExp: /(?:-([tq]\d+))?((\.dev\.intern)|(\.intern\.dev))\.nav\.no/,
        ifMatch: (match) => {
            const environment = match[1] || 'q1';
            return {
                environment,
                envclass: 'dev',
                urlformat: UrlFormat.NAV_NO
            };
        }
    },
    {
        regExp: /\.intern\.nav\.no/,
        ifMatch: (match) => ({ environment: 'p', envclass: 'p', urlformat: UrlFormat.NAV_NO })
    },
    {
        regExp: /.*/,
        ifMatch: () => ({ environment: 'p', envclass: 'p', urlformat: UrlFormat.ADEO })
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

export function finnMiljoStreng(useDevDomain: boolean = false) {
    const miljo = hentMiljoFraUrl().environment;
    if (miljo === 'p') {
        return '';
    }
    const miljoMedLocalFallback = miljo === 'local' ? 'q1' : miljo;
    const devSuffix = useDevDomain ? '.dev' : '';
    return `-${miljoMedLocalFallback}${devSuffix}`;
}

export function finnNaisMiljoStreng(envNamespace: boolean = false) {
    const miljo = hentMiljoFraUrl().environment;
    const prefix = envNamespace && miljo !== 'p' ? `-${miljo}` : '';
    if (miljo === 'p') {
        return `${prefix}.nais.adeo.no`;
    }
    return `${prefix}.nais.preprod.local`;
}

export function finnNaisInternNavMiljoStreng(envNamespace: boolean = false) {
    const miljo = hentMiljoFraUrl().environment;
    const prefix = envNamespace && miljo !== 'p' ? `-${miljo}` : '';
    if (miljo !== 'p') {
        return `${prefix}.dev.intern.nav.no`;
    }
    return `${prefix}.intern.nav.no`;
}
