export function mockFetchEnheter() {
    return Promise.resolve({enhetliste : [ {id: "1111", navn: "NAV Løkka"}, {id: "0322", navn: "NAV Ytterste Enebakk"}]});
}

export function mockFetchVeileder() {
    return Promise.resolve({navn : "DONALD CASING"});
}
