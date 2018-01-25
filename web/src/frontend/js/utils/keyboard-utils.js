const keys = {
    A: 65,
    G: 71,
};

export const erAltG = function (e) {
    return e.altKey && e.which === keys.G;
};