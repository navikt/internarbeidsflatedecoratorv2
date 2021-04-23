export const NAIS_PREPROD_SUFFIX = 'preprod.local/';
export const NAIS_PROD_SUFFIX = 'adeo.no/';
export const NAIS_DEV_INTERN_NAV_PREFIX = '.dev';

export const finnMiljoStreng = () => {
    const host = window.location.host;
    const bindestrekIndex = host.indexOf('-');
    if (bindestrekIndex === -1) {
        return '';
    }
    const dotIndex = host.indexOf('.');
    return host.substring(bindestrekIndex, dotIndex);
};

export const finnNaisMiljoStreng = () => {
    const host = window.location.host;
    const isProd = !host.includes('-') && !host.includes('.preprod.local');
    if (isProd) {
        return NAIS_PROD_SUFFIX;
    }
    return NAIS_PREPROD_SUFFIX;
};

export const finnNaisInternNavMiljoStreng = () => {
    const host = window.location.host;
    const isDev = host.includes('.dev.intern.nav.no');

    if (isDev) {
        return NAIS_DEV_INTERN_NAV_PREFIX;
    }
    return '';
};
