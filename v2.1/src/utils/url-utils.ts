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
        regExp: /navikt\.github\.io/,
        ifMatch: () => ({ environment: 'local', isNaisUrl: false, envclass: 'local' })
    },
    {
        regExp: /\.herokuapp\.com/,
        ifMatch: () => ({ environment: 'local', isNaisUrl: false, envclass: 'local' })
    },
    {
        regExp: /\.labs\.nais\.io/,
        ifMatch: () => ({ environment: 'local', isNaisUrl: true, envclass: 'local' })
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
        regExp: /-([tq]\d+)\.dev\.adeo\.no/,
        ifMatch: (match) => ({ environment: match[1], isNaisUrl: false, envclass: 'dev' })
    },
    {
        regExp: /\.dev\.adeo\.no/,
        ifMatch: (match) => ({ environment: 'q0', isNaisUrl: false, envclass: 'dev' })
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
        regExp: /\.dev\.intern\.nav\.no/,
        ifMatch: (match) => ({ environment: 'q0', isNaisUrl: true, envclass: 'dev' })
    },
    {
        regExp: /\.intern\.nav\.no/,
        ifMatch: (match) => ({ environment: 'p', isNaisUrl: true, envclass: 'p' })
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

export function finnMiljoStreng(useDevDomain: boolean = false) {
    const miljo = hentMiljoFraUrl().environment;
    if (miljo === 'p') {
        return '';
    }
    const miljoMedLocalFallback = miljo === 'local' ? 'q0' : miljo;
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
