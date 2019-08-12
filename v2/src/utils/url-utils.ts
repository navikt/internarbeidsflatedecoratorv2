export const NAIS_PREPROD_SUFFIX = 'preprod.local/';
export const NAIS_PROD_SUFFIX = 'adeo.no/';

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
    const isProd = !host.includes('-');
    if (isProd) {
        return NAIS_PROD_SUFFIX;
    }
    return NAIS_PREPROD_SUFFIX;
};

declare global {
    interface Window {
        msCrypto: {}
    }
}

export function randomCallId() {
    let idx = 0;
    const c = window.crypto || window.msCrypto;
    const rnd = Array.from(c.getRandomValues(new Uint8Array(32))).map((value) =>
        (value & 15).toString(16)
    );
    return '00000000-0000-0000-0000-000000000000'.replace(/0/g, () => rnd[idx++]);
}
