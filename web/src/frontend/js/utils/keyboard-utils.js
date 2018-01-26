export const keys = {
    A: 65,
    G: 71,
    I: 73,
    P: 80,
    F3: 114,
    F5: 116,
};

export function erAltG(e) {
    return e.altKey && e.which === keys.G;
}

export function erAltI(e) {
    return e.altKey && e.which === keys.I;
}

export function erAltP(e) {
    return e.altKey && e.which === keys.P;
}

export function erAltF5(e) {
    return e.altKey && e.which === keys.F5;
}

export function erAltF3(e) {
    return e.altKey && e.which === keys.F3;
}
