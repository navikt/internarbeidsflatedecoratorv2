export const finnMiljoStreng = () => {
    const host = window.location.host;
    const bindestrekIndex = host.indexOf('-');
    if (bindestrekIndex === -1) {
        return '';
    }
    const dotIndex = host.indexOf('.');
    return host.substring(bindestrekIndex, dotIndex);
};

export const erDev = () => {
    const url = window.location.href;
    return url.includes('devillo.no:') || url.includes('localhost:');
};
