export function mockFetchEnheter() {
    return new Promise((resolve) => {
        resolve({enhetliste : [ {id: "1111", navn: "NAV Løkka"}, {id: "0322", navn: "NAV Ytterste Enebakk"}]})
    });
}

export function mockFetchVeileder() {
    return new Promise((resolve) => {
        resolve({navn : "DONALD CASING"})
    });
}
