export const keys = {
    A: 65,
    G: 71,
    I: 73,
    P: 80,
    F3: 114,
    F5: 116,
};

export const erAltG = function (e) {
    return e.altKey && e.which === keys.G;
};

export const erAltI = function (e) {
    return e.altKey && e.which === keys.I;
};

export const erAltP = function (e) {
    return e.altKey && e.which === keys.P;
};

export const erAltF5 = function (e) {
    return e.altKey && e.which === keys.F5;
};

export const erAltF3 = function (e) {
    return e.altKey && e.which === keys.F3;
};
