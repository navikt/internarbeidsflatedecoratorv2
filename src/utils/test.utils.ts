export function withLocation(host: string, assertion: () => void) {
    const original = window.location;
    delete window.location;
    window.location = { host } as any;
    assertion();
    window.location = original;
}
